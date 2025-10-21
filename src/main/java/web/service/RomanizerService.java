package web.service;

import net.crizin.KoreanRomanizer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;

@Service
@Transactional
public class RomanizerService {

    // [*] 한국어 예문 발음기호 변환 서비스 로직
    public String romanize(String koreanText) {
        try {
            return KoreanRomanizer.romanize(koreanText);
        } catch (Exception e) {
            throw new IllegalStateException("발음 기호를 변환할 수 없습니다.", e);
        }

    }

}
