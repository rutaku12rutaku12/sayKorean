package web.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import web.model.mapper.TestMapper;

@Service
@RequiredArgsConstructor
public class TestService { // class start

    private final TestMapper testMapper;

} // class end
