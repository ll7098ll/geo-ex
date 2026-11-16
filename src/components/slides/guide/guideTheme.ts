export interface GuideThemeTokens {
  bg: string;
  text: string;
  muted: string;
  subtle: string;
  surface: string;
  card: string;
  border: string;
  stickyBg: string;
  dropCap: string;
  prose: string;
  levelIdle: string;
}

export const DARK_GUIDE_THEME: GuideThemeTokens = {
  bg: 'bg-[#0A0A0C]',
  text: 'text-[#EDE9E0]',
  muted: 'text-zinc-300',
  subtle: 'text-zinc-400',
  surface: 'bg-[#121317]',
  card: 'bg-[#14151A]',
  border: 'border-white/10',
  stickyBg: 'bg-[#0A0A0C]/92',
  dropCap: 'magazine-drop-cap',
  prose:
    'prose prose-invert prose-headings:font-serif prose-headings:font-black prose-headings:text-white prose-p:text-[#DCD7CE] prose-p:font-serif prose-p:leading-[1.9] prose-strong:text-white prose-li:text-[#DCD7CE] prose-li:font-serif prose-blockquote:border-l-[#FFCC00] prose-blockquote:text-[#EDE9E0]',
  levelIdle: 'text-zinc-400 hover:text-white',
};

export const PAPER_GUIDE_THEME: GuideThemeTokens = {
  bg: 'bg-[#F6F3EC]',
  text: 'text-[#181715]',
  muted: 'text-[#5C5852]',
  subtle: 'text-[#7A746B]',
  surface: 'bg-[#EDE8DD]',
  card: 'bg-[#FAF8F3]',
  border: 'border-[#181715]/12',
  stickyBg: 'bg-[#F6F3EC]/92',
  dropCap: 'magazine-drop-cap-paper',
  prose:
    'prose prose-stone prose-headings:font-serif prose-headings:font-black prose-headings:text-[#181715] prose-p:text-[#2A2825] prose-p:font-serif prose-p:leading-[1.9] prose-strong:text-[#181715] prose-li:text-[#2A2825] prose-li:font-serif prose-blockquote:border-l-[#FFCC00] prose-blockquote:text-[#181715]',
  levelIdle: 'text-[#5C5852] hover:text-[#181715]',
};
