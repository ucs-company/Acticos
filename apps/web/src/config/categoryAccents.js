export const CATEGORY_ACCENTS = {
  'preservatives-speciality-ingredients': {
    bar: 'bg-[#2F6B5A]',
    soft: 'bg-[#2F6B5A]/10',
    text: 'text-[#2F6B5A]',
    border: 'border-[#2F6B5A]/20',
  },
  'active-ingredients': {
    bar: 'bg-[#8A5A14]',
    soft: 'bg-[#8A5A14]/10',
    text: 'text-[#8A5A14]',
    border: 'border-[#8A5A14]/20',
  },
  'emmolient-esters': {
    bar: 'bg-[#3E6170]',
    soft: 'bg-[#3E6170]/10',
    text: 'text-[#3E6170]',
    border: 'border-[#3E6170]/20',
  },
  'proprietery-blend-actives': {
    bar: 'bg-[#5E4A76]',
    soft: 'bg-[#5E4A76]/10',
    text: 'text-[#5E4A76]',
    border: 'border-[#5E4A76]/20',
  },
};

export const getCategoryAccent = (slug) => CATEGORY_ACCENTS[slug] || {
  bar: 'bg-electric',
  soft: 'bg-electric/10',
  text: 'text-electric',
  border: 'border-electric/20',
};
