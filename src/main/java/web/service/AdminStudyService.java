package web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.mapper.AdminStudyMapper;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminStudyService {
    // DI
    private final AdminStudyMapper adminStudyMapper;
}
