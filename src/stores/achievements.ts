export type AchievementDef = {
    id: string;
    threshold: number; // 본 영화( WATCHED ) 기준 누적 편수
    title: string;     // 한국어 직함
    imgUrl: string;
    subTitle: string; // 설명
};

export const ACHIEVEMENTS: AchievementDef[] = [
    {
        id: 'newcomer',
        threshold: 6,
        title: '새내기 영화인',
        subTitle: '나도 이제 영화를 보기 시작했어 ♪',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/newcomer.png'
    },
    {
        id: 'casual_viewer',
        threshold: 12,
        title: '느긋한 감상가',
        subTitle: '천천히 봐도 영화는 참 즐거운 거야 ☁️',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/casual_viewer.png'
    },
    {
        id: 'regular',
        threshold: 18,
        title: '극장 단골',
        subTitle: '이제는 익숙한 자리가 하나쯤 생겼어.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/regular.png'
    },
    {
        id: 'logger',
        threshold: 24,
        title: '꾸준한 기록가',
        subTitle: '하나씩 적어두다 보니 제법 근사해졌는걸 📖',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/logger.png'
    },
    {
        id: 'immersed',
        threshold: 30,
        title: '굉장한 몰입러',
        subTitle: '보다 보면 마음이 쏘옥 들어가버려 ♪',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/immersed.png'
    },
    {
        id: 'empathy',
        threshold: 36,
        title: '감정이입 장인',
        subTitle: '웃고 울고, 마음이 바빠지는 하루야.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/empathy.png'
    },
    {
        id: 'archivist',
        threshold: 42,
        title: '영화 기록광',
        subTitle: '좋아하는 건 차곡차곡 모아두고 싶어져.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/archivist.png'
    },
    {
        id: 'spoiler_free',
        threshold: 48,
        title: '스포 없는 추천러',
        subTitle: '좋은 이야기는 살짝만 알려줘도 반짝여 ✨',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/spoiler_free.png'
    },
    {
        id: 'after_glow',
        threshold: 54,
        title: '여운 수집가',
        subTitle: '끝난 뒤에도 마음에 오래오래 남아 있어 🌙',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/after_glow.png'
    },
    {
        id: 'credit_watcher',
        threshold: 60,
        title: '크레딧 끝까지 보는 타입',
        subTitle: '마지막 글자까지 보고 나야 진짜 끝이야.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/credit_watcher.png'
    },
    {
        id: 'resident',
        threshold: 66,
        title: '극장 상주민',
        subTitle: '이 정도면 극장이랑 꽤 친한 사이야 🪑',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/resident.png'
    },
    {
        id: 'staff_mode',
        threshold: 72,
        title: '영화관 숨은 직원',
        subTitle: '분위기만 봐도 다 아는 경지에 왔어 후후 ♪',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/staff_mode.png'
    },
    {
        id: 'veteran',
        threshold: 78,
        title: '극장 터줏대감',
        subTitle: '오래 머문 만큼 정이 쌓였어 ☕',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/veteran.png'
    },
    {
        id: 'screen_ghost',
        threshold: 84,
        title: '스크린 지박령',
        subTitle: '어라, 또 와버렸네. 오늘도 여기야 👻',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/screen_ghost.png'
    },
    {
        id: 'film_master',
        threshold: 90,
        title: '필름 마스터',
        subTitle: '이쯤 되면 영화랑 제법 오래된 친구야 🎞️',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/film_master.png'
    },
    {
        id: 'cinephile',
        threshold: 96,
        title: '동네 공인 시네필',
        subTitle: '영화 이야기가 나오면 눈이 반짝여 ✨',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/cinephile.png'
    },
    {
        id: 'last_viewer',
        threshold: 102,
        title: '영화관 마지막 손님',
        subTitle: '불이 켜질 때까지 남아 있는 것도 나쁘지 않아 🌃',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/last_viewer.png'
    },
];