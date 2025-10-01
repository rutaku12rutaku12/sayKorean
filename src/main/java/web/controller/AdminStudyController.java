package web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.service.AdminStudyService;

@RestController
@RequestMapping("/saykorean/admin/study")
@RequiredArgsConstructor
public class AdminStudyController {
    // DI
    private final AdminStudyService adminStudyService;

}
