package com.synvex.backend.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import com.synvex.backend.goal.entity.GoalStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentGoalDTO {
    private Long id;
    private String title;
    private LocalDate deadline;
    private Integer progressPercentage;
    private GoalStatus status;
}