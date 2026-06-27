package com.synvex.backend.analytics.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class AnalyticsRequestDTO {

    @NotBlank
    private String goal;

    @NotNull
    private LocalDate deadline;

    @NotNull
    @Min(0)
    @Max(100)
    private Integer progressPercentage;

    @NotNull
    @Min(0)
    private Integer completedTasks;

    @NotNull
    @Min(0)
    private Integer pendingTasks;

    @NotNull
    @Positive
    private Integer availableHours;
}