package com.synvex.backend.goal.service;

import com.synvex.backend.goal.dto.GoalDTO;
import com.synvex.backend.goal.dto.GoalProgressUpdateDTO;
import com.synvex.backend.goal.entity.Goal;
import com.synvex.backend.goal.entity.GoalStatus;
import com.synvex.backend.goal.entity.RiskLevel;
import com.synvex.backend.goal.repository.GoalRepository;
import com.synvex.backend.user.entity.User;
import com.synvex.backend.user.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalService(GoalRepository goalRepository, UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Goal createGoal(String email, GoalDTO goalDTO) {
        User user = getAuthenticatedUser(email);

        Goal goal = Goal.builder()
                .title(goalDTO.getTitle())
                .description(goalDTO.getDescription())
                .deadline(goalDTO.getDeadline())
                .priority(goalDTO.getPriority())
                .status(GoalStatus.NOT_STARTED)
                .riskLevel(RiskLevel.ON_TRACK)
                .progressPercentage(0)
                .user(user)
                .build();

        return goalRepository.save(goal);
    }

    @Transactional(readOnly = true)
    public List<Goal> getAllGoals(String email) {
        User user = getAuthenticatedUser(email);
        return goalRepository.findByUserId(user.getId());
    }

    @Transactional(readOnly = true)
    public Goal getGoalById(String email, Long goalId) {
        User user = getAuthenticatedUser(email);
        Goal goal = getGoalOrThrow(goalId);
        verifyOwnership(goal, user);
        return goal;
    }

    @Transactional
    public Goal updateGoal(String email, Long goalId, GoalDTO goalDTO) {
        User user = getAuthenticatedUser(email);
        Goal goal = getGoalOrThrow(goalId);
        verifyOwnership(goal, user);

        goal.setTitle(goalDTO.getTitle());
        goal.setDescription(goalDTO.getDescription());
        goal.setDeadline(goalDTO.getDeadline());
        goal.setPriority(goalDTO.getPriority());

        return goalRepository.save(goal);
    }

    @Transactional
    public Goal updateGoalProgress(String email, Long goalId, GoalProgressUpdateDTO dto) {
        User user = getAuthenticatedUser(email);
        Goal goal = getGoalOrThrow(goalId);
        verifyOwnership(goal, user);

        goal.setProgressPercentage(dto.getProgressPercentage());

        return goalRepository.save(goal);
    }

    @Transactional
    public void deleteGoal(String email, Long goalId) {
        User user = getAuthenticatedUser(email);
        Goal goal = getGoalOrThrow(goalId);
        verifyOwnership(goal, user);

        goalRepository.delete(goal);
    }

    private User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    private Goal getGoalOrThrow(Long goalId) {
        return goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + goalId));
    }

    private void verifyOwnership(Goal goal, User user) {
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to access this goal.");
        }
    }
}
