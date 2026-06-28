package com.synvex.backend.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpcomingDeadlineDTO {
    private Long goalId;
    private String title;
    private LocalDate deadline;
    private Integer progressPercentage;
}