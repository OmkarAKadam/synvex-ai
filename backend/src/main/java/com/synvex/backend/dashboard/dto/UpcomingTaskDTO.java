package com.synvex.backend.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import com.synvex.backend.task.entity.TaskStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpcomingTaskDTO {
    private Long id;
    private String title;
    private LocalDate dueDate;
    private TaskStatus status;
}