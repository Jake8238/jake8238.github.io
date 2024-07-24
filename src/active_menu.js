/**
 * 별도의 기능은 별도의 파일로 구현. 필요없어지면 빼거나 수정할때도 쉽다.
 * 구현계획
 * 1. 모든 섹션 요소들과 메뉴 아이템들을 가지고 온다.
 * 2. IntersectionObserver를 사용해서 모든 섹션들을 관찰
 * 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다.
 * 보여지는 섹션:
 * - 다수의 섹션이 동시에 보여진다면, 가장 첫번째 섹션을 선택
 * - 마지막 contact 섹션이 보여지면, 마지막 섹션을 선택
 *
 */

const sectionIds = [
  '#home',
  '#about',
  '#skills',
  '#work',
  '#testimonial',
  '#contact',
];

// const homeSection = document.querySelector('#home');
// const homeMenu = document.querySelector('[href="#home"]');
// 이런식으로 하나씩 가져와도 되지만...반복하기 때문에 아래처럼 코딩 map 사용

// intersection callback 함수는 기본적으로 진입했을때, 빠져나갔을 때에만 호출된다.

const sections = sectionIds.map((id) => document.querySelector(id));
const navItems = sectionIds.map((id) =>
  document.querySelector(`[href="${id}"]`)
);
const visibleSections = sectionIds.map(() => false);
let activeNavItem = navItems[0];

const options = {
  rootMargin: '-20% 0px 0px 0px',
  threshold: [0, 0.98], // 가끔 1일 때 안되서 0.98 쓰기도 함
};
const observer = new IntersectionObserver(observerCallback, options);
sections.forEach((section) => observer.observe(section));

function observerCallback(entries) {
  let selectLastOne;
  entries.forEach((entry) => {
    const index = sectionIds.indexOf(`#${entry.target.id}`);
    visibleSections[index] = entry.isIntersecting;
    selectLastOne =
      index === sectionIds.length - 1 &&
      entry.isIntersecting &&
      entry.intersectionRatio >= 0.97;
    // 3가지 조건이 true가 되면 selectLastOne이 true, 기본은 undefined
  });
  console.log(visibleSections);
  console.log('무조건 라스트 섹션!!', selectLastOne);

  const navIndex = selectLastOne
    ? sectionIds.length - 1 // ture면 이거(마지막 섹션)
    : findFirstIntersecting(visibleSections); // false면, 섹션 찾아라
  console.log(sectionIds[navIndex]);
  selectNavItem(navIndex);
}

function selectNavItem(index) {
  const navItem = navItems[index];
  if (!navItem) return;
  activeNavItem.classList.remove('active');
  activeNavItem = navItem;
  activeNavItem.classList.add('active');
}

function findFirstIntersecting(intersections) {
  const index = intersections.indexOf(true); // 첫번째 true 인덱스
  return index >= 0 ? index : 0;
  // indexOf : 아이템 없으면 -1 반환한다.
}
