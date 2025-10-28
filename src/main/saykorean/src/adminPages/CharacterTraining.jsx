import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../store/adminSlice";
import "../styles/AdminCommon.css";

export default function CharacterTraining() {
    const dispatch = useDispatch();
    
    // 학습 관련 state
    const [trainingImages, setTrainingImages] = useState([]);
    const [characterName, setCharacterName] = useState("saykorean_bear");
    const [previewUrls, setPreviewUrls] = useState([]);
    const [isTraining, setIsTraining] = useState(false);
    const [trainingResult, setTrainingResult] = useState(null);
    
    // 현재 학습된 모델 정보
    const [characterInfo, setCharacterInfo] = useState(null);

    useEffect(() => {
        fetchCharacterInfo();
    }, []);

    // 학습된 캐릭터 정보 조회
    const fetchCharacterInfo = async () => {
        try {
            const response = await fetch('http://localhost:8080/saykorean/admin/character/info');
            const data = await response.json();
            setCharacterInfo(data);
        } catch (error) {
            console.error('캐릭터 정보 조회 실패:', error);
        }
    };

    // 이미지 파일 선택 핸들러
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length < 10) {
            alert('최소 10장의 이미지가 필요합니다.');
            return;
        }
        
        if (files.length > 20) {
            alert('최대 20장까지만 업로드 가능합니다.');
            return;
        }
        
        setTrainingImages(files);
        
        // 미리보기 URL 생성
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    // 캐릭터 학습 시작
    const handleStartTraining = async () => {
        if (trainingImages.length < 10) {
            alert('최소 10장의 학습 이미지가 필요합니다.');
            return;
        }

        if (!characterName.trim()) {
            alert('캐릭터 이름을 입력해주세요.');
            return;
        }

        const confirmStart = window.confirm(
            `캐릭터 학습을 시작합니다.\n` +
            `- 이미지 수: ${trainingImages.length}장\n` +
            `- 캐릭터명: ${characterName}\n` +
            `- 예상 소요시간: 10~20분\n\n` +
            `학습 중에는 창을 닫지 마세요.`
        );

        if (!confirmStart) return;

        try {
            setIsTraining(true);
            dispatch(setLoading(true));

            const formData = new FormData();
            trainingImages.forEach(image => {
                formData.append('trainingImages', image);
            });
            formData.append('characterName', characterName);

            const response = await fetch('http://localhost:8080/saykorean/admin/character/train', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                setTrainingResult(result);
                alert('캐릭터 학습이 완료되었습니다!\n이제 이미지 생성에 사용할 수 있습니다.');
                fetchCharacterInfo();
            } else {
                alert('학습 실패: ' + result.message);
            }

        } catch (error) {
            console.error('학습 중 오류:', error);
            alert('학습 중 오류가 발생했습니다.');
        } finally {
            setIsTraining(false);
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="admin-container">
            <h2>🎨 캐릭터 학습 관리</h2>

            {/* 현재 학습된 캐릭터 정보 */}
            {characterInfo && (
                <div className={`admin-section ${characterInfo.trained ? 'admin-success-box' : 'admin-warning-box'}`}>
                    <h3>현재 상태</h3>
                    {characterInfo.trained ? (
                        <div>
                            <p className="admin-text-success">✅ 학습된 캐릭터가 있습니다.</p>
                            <p><strong>트리거 단어:</strong> {characterInfo.triggerWord}</p>
                            <p><strong>모델 버전:</strong> {characterInfo.modelVersion?.substring(0, 20)}...</p>
                        </div>
                    ) : (
                        <div>
                            <p className="admin-text-warning">⚠️ 학습된 캐릭터가 없습니다.</p>
                            <p>아래에서 캐릭터 학습을 진행해주세요.</p>
                        </div>
                    )}
                </div>
            )}

            {/* 학습 안내 */}
            <div className="admin-section">
                <h3>📚 학습 가이드</h3>
                <div className="admin-info-box">
                    <h4>학습 이미지 준비 방법:</h4>
                    <ul>
                        <li>✅ <strong>10~20장</strong>의 캐릭터 이미지 필요</li>
                        <li>✅ <strong>다양한 각도</strong>: 정면, 측면, 뒷모습</li>
                        <li>✅ <strong>다양한 표정</strong>: 웃는 얼굴, 우는 얼굴, 화난 얼굴 등</li>
                        <li>✅ <strong>다양한 상황</strong>: 앉기, 서기, 걷기, 뛰기 등</li>
                        <li>✅ <strong>일관된 스타일</strong>: 모든 이미지가 같은 캐릭터여야 함</li>
                        <li>✅ <strong>깔끔한 배경</strong>: 단색 또는 심플한 배경 권장</li>
                    </ul>
                    
                    <h4 className="admin-mt-md">⏰ 소요시간:</h4>
                    <p>약 10~20분 (이미지 수에 따라 다름)</p>
                    
                    <h4 className="admin-mt-md">💰 비용:</h4>
                    <p>학습 1회당 약 $1~2 (Replicate 기준)</p>
                </div>
            </div>

            {/* 학습 이미지 업로드 */}
            <div className="admin-section">
                <h3>1️⃣ 학습 이미지 업로드</h3>
                
                <div className="admin-form-group">
                    <label className="admin-form-label">캐릭터 이름 (트리거 단어)</label>
                    <input
                        type="text"
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                        className="admin-input"
                        placeholder="예: saykorean_bear"
                        disabled={isTraining}
                    />
                    <p className="admin-hint">
                        💡 영문, 숫자, 언더스코어(_)만 사용 가능합니다.
                    </p>
                </div>

                <div className="admin-form-group">
                    <label className="admin-form-label">학습 이미지 선택 (10~20장)</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="admin-input"
                        disabled={isTraining}
                    />
                    {trainingImages.length > 0 && (
                        <p className="admin-text-success admin-mt-sm">
                            ✓ {trainingImages.length}장 선택됨
                        </p>
                    )}
                </div>

                {/* 이미지 미리보기 */}
                {previewUrls.length > 0 && (
                    <div className="admin-mt-md">
                        <label className="admin-form-label">미리보기:</label>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: '12px',
                            marginTop: '12px'
                        }}>
                            {previewUrls.map((url, index) => (
                                <div key={index} style={{
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    aspectRatio: '1',
                                    position: 'relative'
                                }}>
                                    <img 
                                        src={url} 
                                        alt={`Training ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '4px',
                                        right: '4px',
                                        background: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        fontSize: '12px'
                                    }}>
                                        {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 학습 시작 버튼 */}
            <div className="admin-action-buttons">
                <button
                    onClick={handleStartTraining}
                    disabled={isTraining || trainingImages.length < 10}
                    className="admin-btn admin-btn-lg admin-btn-primary"
                >
                    {isTraining ? '⏳ 학습 중... (10~20분 소요)' : '🚀 캐릭터 학습 시작'}
                </button>
            </div>

            {/* 학습 진행 상태 */}
            {isTraining && (
                <div className="admin-section" style={{ 
                    background: '#fff3cd', 
                    border: '2px solid #ffc107' 
                }}>
                    <h3>⏳ 학습 진행 중...</h3>
                    <p>학습이 완료될 때까지 기다려주세요.</p>
                    <p>브라우저 창을 닫지 마세요!</p>
                    <div className="admin-loading-bar">
                        <div className="admin-loading-bar-inner"></div>
                    </div>
                </div>
            )}

            {/* 학습 결과 */}
            {trainingResult && (
                <div className="admin-section" style={{ 
                    background: '#d4edda', 
                    border: '2px solid #28a745' 
                }}>
                    <h3>✅ 학습 완료!</h3>
                    <p><strong>트리거 단어:</strong> {trainingResult.triggerWord}</p>
                    <p><strong>모델 버전:</strong> {trainingResult.modelVersion?.substring(0, 30)}...</p>
                    <p className="admin-mt-md">
                        이제 "교육 등록" 페이지에서 이미지 생성 시 학습된 캐릭터가 사용됩니다.
                    </p>
                </div>
            )}
        </div>
    );
}