package com.synvex.backend.user.dto;

import com.synvex.backend.user.entity.WorkStyle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponseDTO {

    private Long id;

    private String name;

    private String email;

    private String occupation;

    private Integer availableHours;

    private WorkStyle workStyle;
}
