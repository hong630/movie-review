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
        subTitle:'가장 개인적인 것이 가장 창의적인 것이다.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/newcomer.png'
    },
    {
        id: 'casual_viewer',
        threshold: 12,
        title: '느긋한 감상가',
        subTitle:'영화는 사람들이 삶에서 느끼는 공허함과 외로움을 채워 줄수있다.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/casual_viewer.png'
    },
    {
        id: 'regular',
        threshold: 18,
        title: '극장 단골',
        subTitle: '아침에 당신을 벌떡 깨울 수 있는 꿈을 가져야 한다.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/regular.png'
    },
    {
        id: 'logger',
        threshold: 24,
        title: '꾸준한 기록가',
        subTitle: '영화는 무엇이 프레임 안에 있고, 무엇이 프레임 밖에 있는지의 문제다.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/logger.png'
    },
    {
        id: 'immersed',
        threshold: 30,
        title: '굉장한 몰입러',
        subTitle: '관객과 감독은 사디스트와 마조히스트다.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/immersed.png'
    },
    {
        id: 'empathy',
        threshold: 36,
        title: '감정이입 장인',
        subTitle: '삶은 매우,매우,매우 복잡하다. 따라서 난해한 영화 역시 허락되어야 한다.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/empathy.png'
    },
    {
        id: 'archivist',
        threshold: 42,
        title: '영화 기록광',
        subTitle: '인간은 모두 공통적인 고민을 안고 살아간다. 그것을 제대로 묘사하는 영화만이 이해될 수 있다.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/archivist.png'
    },
    {
        id: 'spoiler_free',
        threshold: 48,
        title: '스포 없는 추천러',
        subTitle: '당신이 눈을 열고, 마음도 연다면, 모든게 흥미로워질 수 있어요.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/spoiler_free.png'
    },
    {
        id: 'after_glow',
        threshold: 54,
        title: '여운 수집가',
        subTitle: '의미란 계속 물을수록 무의미해진다.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/after_glow.png'
    },
    {
        id: 'credit_watcher',
        threshold: 60,
        title: '크레딧 끝까지 보는 타입',
        subTitle: '예술의 적은 한계의 부재다.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/credit_watcher.png'
    },
    {
        id: 'resident',
        threshold: 66,
        title: '극장 상주민',
        subTitle: ' 당신의 노력을 존중하라. 당신 자신을 존중하라.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/resident.png'
    },
    {
        id: 'staff_mode',
        threshold: 72,
        title: '영화관 숨은 직원',
        subTitle: '세상엔 보이는 것과 보이지 않는 것이 있다. 보이는 것만 찍으면, 당신은 TV영화를 만들 뿐이다.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/staff_mode.png'
    },
    {
        id: 'veteran',
        threshold: 78,
        title: '극장 터줏대감',
        subTitle: '한번도 실패하지 않는다는 것은 언제나 안이하게 산다는 증거다.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/veteran.png'
    },
    {
        id: 'screen_ghost',
        threshold: 84,
        title: '스크린 지박령',
        subTitle: '필요하다면 지옥에 내려가 악마로부터 영화를 뺏어올 것이다.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/screen_ghost.png'
    },
    {
        id: 'film_master',
        threshold: 90,
        title: '필름 마스터',
        subTitle: '삶은 가까이서 보면 비극이고, 멀리서 보면 희극이다.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/film_master.png'
    },
    {
        id: 'cinephile',
        threshold: 96,
        title: '동네 공인 시네필',
        subTitle: '영화란, 진리를 위한, 혹은 진리를 찾기 위한 초당 24개의 거짓들이다.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/cinephile.png'
    },
    {
        id: 'last_viewer',
        threshold: 102,
        title: '영화관 마지막 손님',
        subTitle: '영화는 현실의 반영이 아니라 반영의 현실이다.',
        imgUrl: 'https://pub-8064e7cc3a73402c81d17495cac01ced.r2.dev/last_viewer.png'
    },
];