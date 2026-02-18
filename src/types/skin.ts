export type SkinTarget = 'ticket' | 'watched';

export type SkinTier = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export type SkinDef = {
    id: string;
    target: SkinTarget;
    name: string;
    desc: string;
    emoji: string;
    tier: SkinTier;
    price: number;
    className: string;
};
