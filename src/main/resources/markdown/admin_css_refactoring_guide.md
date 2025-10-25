
# 관리자 페이지 CSS 리팩토링 가이드

이 문서는 관리자 페이지의 가독성 및 유지보수성 향상을 위해 인라인 스타일을 `AdminCommon.css` 파일로 분리하는 방법을 안내합니다.

## 1. `AdminCommon.css` 업데이트

기존 `AdminCommon.css` 파일에 아래 클래스를 추가하여 공통 스타일을 강화합니다.

```css
/* AdminHome.jsx 버튼 색상 */
.admin-btn-education-create {
  background-color: #A8E6CF;
  color: white;
}
.admin-btn-education-list {
  background-color: #FFAAA5;
  color: white;
}
.admin-btn-test-create {
  background-color: #FF8C6B;
  color: white;
}
.admin-btn-test-list {
  background-color: #6B4E42;
  color: white;
}

/* 공통 버튼 스타일 */
.admin-btn-primary {
  background-color: #4CAF50;
  color: white;
}
.admin-btn-secondary {
  background-color: #9E9E9E;
  color: white;
}
.admin-btn-warning {
  background-color: #FFC107;
  color: black;
}
.admin-btn-danger {
  background-color: #f44336;
  color: white;
}
.admin-btn-special {
  background-color: #673AB7;
  color: white;
}
.admin-btn-action {
  background-color: #2196F3;
  color: white;
}

/* 입력 필드 */
.admin-input-width-300 {
  width: 300px;
}
.admin-input-width-320 {
  width: 320px;
}

/* 오디오 아이템 */
.admin-audio-item-lang {
  padding: 2px 8px;
  color: white;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
}
.admin-audio-item-lang-tts {
  background-color: #2196F3;
}
.admin-audio-item-lang-file {
  background-color: #FF9800;
}
.admin-audio-item-text-content {
  flex: 1;
  font-size: 14px;
}

/* 시험 목록 아이템 */
.admin-test-item-header {
  display: inline-block;
  padding: 3px 10px;
  background-color: #2196F3;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 10px;
}
.admin-test-item-type {
  font-size: 14px;
  font-weight: bold;
}
.admin-test-item-details p {
  margin: 5px 0;
}
.admin-test-item-meta {
  font-size: 12px;
  color: #666;
}
```

## 2. JSX 파일 리팩토링

### `AdminNav.jsx`

`AdminNav.jsx`는 이미 `AdminCommon.css`의 클래스를 잘 활용하고 있어 변경이 필요 없습니다.

### `AdminHome.jsx`

버튼들의 인라인 스타일을 CSS 클래스로 변경합니다.

**변경 전**
```jsx
<button 
    onClick={() => navigate('/admin/study/create')} 
    className="admin-btn admin-btn-lg"
    style={{ backgroundColor: '#A8E6CF', color: 'white' }}
>
    교육 등록하기
</button>
<button
    onClick={() => navigate('/admin/study')}
    className="admin-btn admin-btn-lg"
    style={{ backgroundColor: '#FFAAA5', color: 'white' }}
>
    교육 목록으로 이동
</button>
<button 
    onClick={() => navigate('/admin/test/create')} 
    className="admin-btn admin-btn-lg"
    style={{ backgroundColor: '#FF8C6B', color: 'white' }}
>
    시험 등록하기
</button>
<button
    onClick={() => navigate('/admin/test')}
    className="admin-btn admin-btn-lg"
    style={{ backgroundColor: '#6B4E42', color: 'white' }}
>
    시험 목록으로 이동
</button>
```

**변경 후**
```jsx
<button 
    onClick={() => navigate('/admin/study/create')} 
    className="admin-btn admin-btn-lg admin-btn-education-create"
>
    교육 등록하기
</button>
<button
    onClick={() => navigate('/admin/study')}
    className="admin-btn admin-btn-lg admin-btn-education-list"
>
    교육 목록으로 이동
</button>
<button 
    onClick={() => navigate('/admin/test/create')} 
    className="admin-btn admin-btn-lg admin-btn-test-create"
>
    시험 등록하기
</button>
<button
    onClick={() => navigate('/admin/test')}
    className="admin-btn admin-btn-lg admin-btn-test-list"
>
    시험 목록으로 이동
</button>
```

### `AdminStudyCreate.jsx`

컴포넌트 전반에 걸쳐 사용된 다양한 인라인 스타일을 `admin-` 접두사를 가진 클래스로 대체하여 가독성을 높입니다.

**주요 변경 사항:**
- `div`, `button`, `input`, `select`, `textarea` 등 모든 인라인 스타일을 CSS 클래스로 교체합니다.
- 레이아웃은 `admin-container`, `admin-section`, `admin-grid` 등의 유틸리티 클래스를 활용합니다.
- 버튼은 `admin-btn-primary`, `admin-btn-warning` 등 시맨틱한 클래스명을 사용합니다.

**변경 예시 (일부)**

**변경 전**
```jsx
<div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h2>교육 등록</h2>

    {/* 장르 섹션 */}
    <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>1. 장르 선택</h3>
        <div style={{ marginBottom: '15px' }}>
            <input
                type="text"
                value={newGenreName}
                onChange={(e) => setNewGenreName(e.target.value)}
                style={{ padding: '8px', width: '300px', marginRight: '10px' }}
            />
            <button onClick={handleCreateGenre} style={{ padding: '8px 20px' }}>
                장르 생성
            </button>
        </div>
        {/* ... */}
    </div>
</div>
```

**변경 후**
```jsx
<div className="admin-container">
    <h2 className="admin-mb-xl">교육 등록</h2>

    {/* 장르 섹션 */}
    <div className="admin-section">
        <h3 className="admin-section-title">1. 장르 선택</h3>
        <div className="admin-input-group admin-mt-md">
            <input
                type="text"
                placeholder="새 장르명 입력"
                value={newGenreName}
                onChange={(e) => setNewGenreName(e.target.value)}
                className="admin-input admin-input-width-300"
            />
            <button onClick={handleCreateGenre} className="admin-btn">
                장르 생성
            </button>
        </div>
        {/* ... */}
    </div>
</div>
```

### `AdminStudyEdit.jsx`, `AdminStudyList.jsx`, `AdminTestCreate.jsx`, `AdminTestEdit.jsx`, `AdminTestList.jsx`

위 파일들도 `AdminStudyCreate.jsx`와 유사한 패턴으로 리팩토링을 진행합니다. 모든 인라인 스타일을 `AdminCommon.css`에 정의된 클래스로 대체하여 코드의 일관성과 가독성을 확보합니다.

**리팩토링 핵심 원칙:**
1.  **인라인 스타일 제거:** `style={{...}}` 속성을 모두 제거합니다.
2.  **클래스 기반 스타일링:** `className`을 사용하여 `AdminCommon.css`에 정의된 스타일 클래스를 적용합니다.
3.  **시맨틱 클래스 활용:** `admin-btn-danger` (삭제 버튼), `admin-section` (구획), `admin-grid-2` (2단 그리드) 등 의미에 맞는 클래스명을 사용하여 코드의 가독성을 높입니다.
4.  **일관성 유지:** 모든 관리자 페이지에서 일관된 디자인과 레이아웃을 유지하도록 공통 클래스를 재사용합니다.

이 가이드를 따라 리팩토링을 진행하면, 향후 스타일 변경 및 유지보수가 훨씬 용이해질 것입니다.
