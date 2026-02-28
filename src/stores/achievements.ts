export type AchievementDef = {
    id: string;
    threshold: number; // 본 영화( WATCHED ) 기준 누적 편수
    title: string;     // 한국어 직함
    imgUrl: string;
};

export const ACHIEVEMENTS: AchievementDef[] = [
    {
        id: 'newcomer',
        threshold: 6,
        title: '새내기 영화인',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/newcomer.png'
    },
    {
        id: 'casual_viewer',
        threshold: 12,
        title: '느긋한 감상가',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/casual_viewer.png'
    },
    {
        id: 'regular',
        threshold: 18,
        title: '극장 단골',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/regular.png'
    },
    {
        id: 'logger',
        threshold: 24,
        title: '꾸준한 기록가',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/logger.png'
    },
    {
        id: 'immersed',
        threshold: 30,
        title: '굉장한 몰입러',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/immersed.png'
    },
    {
        id: 'empathy',
        threshold: 36,
        title: '감정이입 장인',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/empathy.png'
    },
    {
        id: 'archivist',
        threshold: 42,
        title: '영화 기록광',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/archivist.png'
    },
    {
        id: 'spoiler_free',
        threshold: 48,
        title: '스포 없는 추천러',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/spoiler_free.png'
    },
    {
        id: 'after_glow',
        threshold: 54,
        title: '여운 수집가',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/after_glow.png'
    },
    // 여기 숫자 너가 안 적어준 것 같아서 "54 다음 56"으로 자연스럽게 넣었어. 원하면 바꿔줄게!
    {
        id: 'credit_watcher',
        threshold: 60,
        title: '크레딧 끝까지 보는 타입',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/credit_watcher.png'
    },
    {
        id: 'resident',
        threshold: 66,
        title: '극장 상주민',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/resident.png'
    },
    {
        id: 'staff_mode',
        threshold: 72,
        title: '영화관 숨은 직원',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/staff_mode.png'
    },
    {
        id: 'veteran',
        threshold: 78,
        title: '극장 터줏대감',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/veteran.png'
    },
    {
        id: 'screen_ghost',
        threshold: 84,
        title: '스크린 지박령',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/screen_ghost.png'
    },
    {
        id: 'film_master',
        threshold: 90,
        title: '필름 마스터',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/film_master.png'
    },
    {
        id: 'cinephile',
        threshold: 96,
        title: '동네 공인 시네필',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/cinephile.png'
    },
    {
        id: 'last_viewer',
        threshold: 102,
        title: '영화관 마지막 손님',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/last_viewer.png'
    },
];