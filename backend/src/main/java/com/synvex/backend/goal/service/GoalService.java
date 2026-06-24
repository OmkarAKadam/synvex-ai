package com.synvex.backend.goal.service;

import com.synvex.backend.goal.dto.GoalDTO;
import com.synvex.backend.goal.entity.Goal;
import com.synvex.backend.goal.entity.GoalStatus;
import com.synvex.backend.goal.entity.RiskLevel;
import com.synvex.backend.goal.repository.GoalRepository;
import com.synvex.backend.user.entity.User;
import com.synvex.backend.user.repository.UserRepository;
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
    public Goal createGoal(Long userId, GoalDTO goalDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

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
    public List<Goal> getAllGoals() {
        return goalRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Goal getGoalById(Long goalId) {
        return goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + goalId));
    }

    @Transactional
    public Goal updateGoal(Long goalId, GoalDTO goalDTO) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + goalId));

        goal.setTitle(goalDTO.getTitle());
        goal.setDescription(goalDTO.getDescription());
        goal.setDeadline(goalDTO.getDeadline());
        goal.setPriority(goalDTO.getPriority());

        return goalRepository.save(goal);
    }

    @Transactional
    public void deleteGoal(Long goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + goalId));

        goalRepository.delete(goal);
    }
}
