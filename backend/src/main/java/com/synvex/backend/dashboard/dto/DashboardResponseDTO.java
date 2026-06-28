package com.synvex.backend.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponseDTO {
    private Long totalGoals;
    private Long completedGoals;
    private Long activeGoals;
    private Long totalTasks;
    private Long completedTasks;
    private Long pendingTasks;
    private Long todayTasks;
    private Integer productivityScore;
    private List<RecentGoalDTO> recentGoals;
    private List<UpcomingTaskDTO> upcomingTasks;
}