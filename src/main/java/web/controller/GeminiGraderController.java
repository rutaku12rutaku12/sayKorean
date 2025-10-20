package web.controller;

import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.model.mapper.RankingMapper;
import web.service.GeminiGraderService;

@RestController
@RequestMapping("/saykorean/test")
@RequiredArgsConstructor
public class GemimiGraderController {

}
