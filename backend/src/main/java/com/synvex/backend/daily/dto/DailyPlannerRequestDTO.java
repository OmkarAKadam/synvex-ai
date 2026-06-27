package com.synvex.backend.daily.dto;

import com.synvex.backend.user.entity.WorkStyle;
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
public class DailyPlannerRequestDTO {

    @NotBlank
    private String goal;

    @NotNull
    private LocalDate date;

    @NotNull
    @Positive
    private Integer availableHours;

    @NotNull
    private WorkStyle workStyle;
}
