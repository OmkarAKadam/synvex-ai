package com.synvex.backend.dashboard.service;

import com.synvex.backend.dashboard.dto.DashboardResponseDTO;
import com.synvex.backend.dashboard.dto.RecentGoalDTO;
import com.synvex.backend.dashboard.dto.UpcomingTaskDTO;
import com.synvex.backend.goal.entity.Goal;
import com.synvex.backend.goal.entity.GoalStatus;
import com.synvex.backend.goal.repository.GoalRepository;
import com.synvex.backend.task.entity.Task;
import com.synvex.backend.task.entity.TaskStatus;
import com.synvex.backend.task.repository.TaskRepository;
import com.synvex.backend.user.entity.User;
import com.synvex.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final GoalRepository goalRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public DashboardService(GoalRepository goalRepository,
                            TaskRepository taskRepository,
                            UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponseDTO getDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        List<Goal> goals = goalRepository.findByUserId(user.getId());
        List<Task> tasks = taskRepository.findByGoalUserId(user.getId());

        LocalDate today = LocalDate.now();

        long totalGoals = goals.size();
        long completedGoals = goals.stream().filter(g -> g.getStatus() == GoalStatus.COMPLETED).count();
        long activeGoals = goals.stream().filter(g -> g.getStatus() != GoalStatus.COMPLETED).count();

        long totalTasks = tasks.size();
        long completedTasks = tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
        long pendingTasks = tasks.stream().filter(t -> t.getStatus() != TaskStatus.COMPLETED).count();

        long todayTasks = tasks.stream()
                .filter(t -> t.getDueDate().equals(today))
                .count();

        int productivityScore = calculateProductivityScore(totalGoals, completedGoals, totalTasks, completedTasks);

        List<RecentGoalDTO> recentGoals = goals.stream()
                .sorted(Comparator.comparing(Goal::getCreatedAt).reversed())
                .limit(5)
                .map(g -> RecentGoalDTO.builder()
                        .id(g.getId())
                        .title(g.getTitle())
                        .deadline(g.getDeadline())
                        .progressPercentage(g.getProgressPercentage())
                        .status(g.getStatus())
                        .build())
                .collect(Collectors.toList());

        List<UpcomingTaskDTO> upcomingTasks = tasks.stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED)
                .sorted(Comparator.comparing(Task::getDueDate))
                .limit(5)
                .map(t -> UpcomingTaskDTO.builder()
                        .id(t.getId())
                        .title(t.getTitle())
                        .dueDate(t.getDueDate())
                        .status(t.getStatus())
                        .build())
                .collect(Collectors.toList());

        return DashboardResponseDTO.builder()
                .totalGoals(totalGoals)
                .completedGoals(completedGoals)
                .activeGoals(activeGoals)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .pendingTasks(pendingTasks)
                .todayTasks(todayTasks)
                .productivityScore(productivityScore)
                .recentGoals(recentGoals)
                .upcomingTasks(upcomingTasks)
                .build();
    }

    private int calculateProductivityScore(long totalGoals, long completedGoals,
                                          long totalTasks, long completedTasks) {
        int goalScore = 0;
        int taskScore = 0;
        if (totalGoals > 0) {
            goalScore = (int) ((completedGoals * 100) / totalGoals);
        }
        if (totalTasks > 0) {
            taskScore = (int) ((completedTasks * 100) / totalTasks);
        }
        return (goalScore + taskScore) / 2;
    }
}