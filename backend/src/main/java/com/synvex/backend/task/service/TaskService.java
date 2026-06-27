package com.synvex.backend.task.service;

import com.synvex.backend.goal.entity.Goal;
import com.synvex.backend.goal.repository.GoalRepository;
import com.synvex.backend.task.dto.TaskDTO;
import com.synvex.backend.task.entity.Task;
import com.synvex.backend.task.entity.TaskStatus;
import com.synvex.backend.task.repository.TaskRepository;
import com.synvex.backend.user.entity.User;
import com.synvex.backend.user.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, GoalRepository goalRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Task createTask(String email, TaskDTO taskDTO) {
        User user = getAuthenticatedUser(email);

        if (taskDTO.getGoalId() == null) {
            throw new RuntimeException("Goal id is required.");
        }

        Goal goal = getGoalOrThrow(taskDTO.getGoalId());
        verifyGoalOwnership(goal, user);

        Task task = Task.builder()
                .title(taskDTO.getTitle())
                .description(taskDTO.getDescription())
                .estimatedHours(taskDTO.getEstimatedHours())
                .priority(taskDTO.getPriority())
                .dueDate(taskDTO.getDueDate())
                .status(TaskStatus.PENDING)
                .completedAt(null)
                .goal(goal)
                .build();

        return taskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public List<Task> getAllTasks(String email) {
        User user = getAuthenticatedUser(email);
        return taskRepository.findByGoalUserId(user.getId());
    }

    @Transactional(readOnly = true)
    public Task getTaskById(String email, Long taskId) {
        User user = getAuthenticatedUser(email);
        Task task = getTaskOrThrow(taskId);
        verifyTaskOwnership(task, user);
        return task;
    }

    @Transactional
    public Task updateTask(String email, Long taskId, TaskDTO taskDTO) {
        User user = getAuthenticatedUser(email);
        Task task = getTaskOrThrow(taskId);
        verifyTaskOwnership(task, user);

        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setEstimatedHours(taskDTO.getEstimatedHours());
        task.setPriority(taskDTO.getPriority());
        task.setDueDate(taskDTO.getDueDate());

        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(String email, Long taskId) {
        User user = getAuthenticatedUser(email);
        Task task = getTaskOrThrow(taskId);
        verifyTaskOwnership(task, user);

        taskRepository.delete(task);
    }

    private User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    private Goal getGoalOrThrow(Long goalId) {
        return goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + goalId));
    }

    private Task getTaskOrThrow(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
    }

    private void verifyTaskOwnership(Task task, User user) {
        verifyGoalOwnership(task.getGoal(), user);
    }

    private void verifyGoalOwnership(Goal goal, User user) {
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to access this task.");
        }
    }
}
