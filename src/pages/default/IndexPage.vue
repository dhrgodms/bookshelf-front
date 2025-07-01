<template>
  <q-page class="flex flex-center customframe" style="min-height: 0%">
    <div class="landing-card">
      <div class="hero-content">
        <h2 class="text-h3 q-mb-md text-weight-bold custom-heading-color">나만의 책장</h2>
        <div class="features-list q-mb-lg">
          <p class="text-body1 text-weight-bold custom-text-color q-mb-sm">
            📚 흩어진 책들을 한곳에 모아
          </p>
          <p class="text-body1 text-weight-bold custom-text-color q-mb-sm">
            ✨ 나만의 방식으로 정리하고
          </p>
          <p class="text-body1 text-weight-bold custom-text-color">🔍 새로운 책을 발견해 보세요!</p>
        </div>
        <q-btn
          class="custom-button-color"
          label="책 검색하기"
          size="lg"
          rounded
          to="/search/book"
        />
      </div>
      <div class="hero-image">
        <img src="../../assets/chosen_bookboogi.png" alt="책 이미지" class="book-image" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
// 스크립트 부분은 지금은 특별히 추가할 내용이 없어!
</script>

<style>
/* 🎨 하퍼의 브랜드 색상 팔레트 정의 */
:root {
  --primary-green: #427957; /* 하퍼의 메인 컬러! 버튼과 중요 요소에 사용할 거야! */
  --primary-light: #5a8c6e; /* 메인 컬러보다 살짝 밝은 버전, 호버 효과 등에 쓸 거야! */
  --primary-dark: #345f45; /* 메인 컬러보다 살짝 어두운 버전, 강조할 때 쓸 거야! */
  --soft-dark: #36454f; /* 짙은 회색, 제목에 쓸 거야! */
  --soft-grey: #696969; /* 중간 회색, 본문 텍스트에 쓸 거야! */
  --light-bg: #f8f8f8; /* 아주 연한 회색, 페이지 배경색으로 쓸 거야! */
  --light-green: #edf5f0; /* 연한 초록색 배경, 강조하고 싶은 섹션에 쓸 거야! */
}

/* 📄 페이지 전체 배경색 */
.q-page {
  background-color: var(--light-bg);
}

/* 📐 프레임 크기 설정 */
.customframe {
  max-width: 1200px;
  min-width: 380px;
  width: 100%;
  height: 94vh;
  padding: 0em 3em 0em 3em;
}

/* 🖼️ 내용이 들어갈 카드 스타일 */
.landing-card {
  background-color: white;
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  align-items: center;
  justify-content: center;
  border-left: 5px solid var(--primary-green);
}

/* ✍️ 왼쪽 내용 영역 */
.hero-content {
  flex: 1;
  min-width: 300px;
  text-align: left;
}

/* 🖼️ 오른쪽 이미지 영역 - 여기를 수정했어! */
.hero-image {
  flex: 1;
  min-width: 200px; /* 최소 너비를 줄여서 더 작게 줄어들 수 있게 했어! */
  max-width: 310px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.book-image {
  width: 100%; /* max-width 대신 width를 사용해서 부모 요소에 맞게 항상 크기가 조절되게 했어! */
  height: auto;
  border-radius: 10px;
  object-fit: contain; /* 이미지 비율을 유지하면서 컨테이너에 맞게 조절되게 했어! */
}

/* ✍️ 제목 색상 */
.custom-heading-color {
  color: var(--primary-dark);
  font-size: 2.8rem;
}

/* 📝 본문 텍스트 색상 및 줄 간격 */
.custom-text-color {
  color: var(--soft-grey);
  line-height: 1.8;
  font-size: 1.1rem;
}

/* 👆 버튼 스타일 */
.custom-button-color {
  background-color: var(--primary-green) !important;
  color: white !important;
  padding: 15px 30px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

/* 버튼에 마우스를 올렸을 때 */
.custom-button-color:hover {
  background-color: var(--primary-light) !important;
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(66, 121, 87, 0.3);
}

/* 모바일 화면 대응 - 여기도 수정했어! */
@media (max-width: 768px) {
  .landing-card {
    flex-direction: column;
    padding: 30px;
  }
  .hero-content {
    text-align: center;
  }
  .custom-heading-color {
    font-size: 2.2rem;
  }
  .custom-text-color {
    font-size: 1rem;
  }
  .hero-image {
    max-width: 250px; /* 모바일에서는 이미지 최대 너비를 더 작게 제한! */
  }
}

/* 더 작은 화면에서의 추가 대응 */
@media (max-width: 480px) {
  .hero-image {
    max-width: 200px; /* 더 작은 화면에서는 이미지를 더 작게! */
  }
}
</style>
