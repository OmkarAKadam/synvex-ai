package com.synvex.backend.task.controller;

import com.synvex.backend.task.dto.TaskDTO;
import com.synvex.backend.task.dto.TaskStatusUpdateDTO;
import com.synvex.backend.task.entity.Task;
import com.synvex.backend.task.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<Task> createTask(Authentication authentication, @Valid @RequestBody TaskDTO taskDTO) {
        Task createdTask = taskService.createTask(authentication.getName(), taskDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(Authentication authentication) {
        List<Task> tasks = taskService.getAllTasks(authentication.getName());
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<Task> getTaskById(Authentication authentication, @PathVariable Long taskId) {
        Task task = taskService.getTaskById(authentication.getName(), taskId);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(
            Authentication authentication,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskDTO taskDTO
    ) {
        Task updatedTask = taskService.updateTask(authentication.getName(), taskId, taskDTO);
        return ResponseEntity.ok(updatedTask);
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<Task> updateTaskStatus(
            Authentication authentication,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskStatusUpdateDTO taskStatusUpdateDTO
    ) {
        Task updatedTask = taskService.updateTaskStatus(
                authentication.getName(),
                taskId,
                taskStatusUpdateDTO.getStatus()
        );
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(Authentication authentication, @PathVariable Long taskId) {
        taskService.deleteTask(authentication.getName(), taskId);
        return ResponseEntity.noContent().build();
    }
}
