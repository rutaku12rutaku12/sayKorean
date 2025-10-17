package web.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.service.TestService;

@RestController
@RequestMapping("/saykorean/test")
@RequiredArgsConstructor
public class TestController { // class start

    private final TestService testService;
}
