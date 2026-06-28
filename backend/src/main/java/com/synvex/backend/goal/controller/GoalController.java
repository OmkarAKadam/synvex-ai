package com.synvex.backend.goal.controller;

import com.synvex.backend.goal.dto.GoalDTO;
import com.synvex.backend.goal.dto.GoalProgressUpdateDTO;
import com.synvex.backend.goal.entity.Goal;
import com.synvex.backend.goal.service.GoalService;
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
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @PostMapping
    public ResponseEntity<Goal> createGoal(Authentication authentication, @Valid @RequestBody GoalDTO goalDTO) {
        Goal createdGoal = goalService.createGoal(authentication.getName(), goalDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGoal);
    }

    @GetMapping
    public ResponseEntity<List<Goal>> getAllGoals(Authentication authentication) {
        List<Goal> goals = goalService.getAllGoals(authentication.getName());
        return ResponseEntity.ok(goals);
    }

    @GetMapping("/{goalId}")
    public ResponseEntity<Goal> getGoalById(Authentication authentication, @PathVariable Long goalId) {
        Goal goal = goalService.getGoalById(authentication.getName(), goalId);
        return ResponseEntity.ok(goal);
    }

    @PutMapping("/{goalId}")
    public ResponseEntity<Goal> updateGoal(
            Authentication authentication,
            @PathVariable Long goalId,
            @Valid @RequestBody GoalDTO goalDTO
    ) {
        Goal updatedGoal = goalService.updateGoal(authentication.getName(), goalId, goalDTO);
        return ResponseEntity.ok(updatedGoal);
    }

    @PatchMapping("/{goalId}/progress")
    public ResponseEntity<Goal> updateGoalProgress(
            Authentication authentication,
            @PathVariable Long goalId,
            @Valid @RequestBody GoalProgressUpdateDTO dto
    ) {
        Goal updatedGoal = goalService.updateGoalProgress(authentication.getName(), goalId, dto);
        return ResponseEntity.ok(updatedGoal);
    }

    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteGoal(Authentication authentication, @PathVariable Long goalId) {
        goalService.deleteGoal(authentication.getName(), goalId);
        return ResponseEntity.noContent().build();
    }
}
