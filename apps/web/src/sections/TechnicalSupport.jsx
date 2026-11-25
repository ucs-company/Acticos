import ProcessSteps from '@/animations/ProcessSteps';
import Reveal from '@/animations/Reveal';
import Button from '@/components/Button';

const STEPS = [
  { title: 'Understand', text: 'We learn the formulation, the format and what the product must deliver.' },
  { title: 'Select', text: 'We shortlist ingredients from the portfolio that fit the brief.' },
  { title: 'Formulate', text: 'You test with samples and technical documents from our team.' },
  { title: 'Optimize', text: 'We refine the choice with you until the formulation performs.' },
];

export default function TechnicalSupport() {
  return (
    <section className="section bg-navy-800 text-white">
      <div className="container-page">
        <Reveal><h2 className="h-section max-w-3xl">From Ingredient Selection to Formulation Support</h2></Reveal>
        <div className="mt-16"><ProcessSteps steps={STEPS} /></div>
        <Reveal delay={0.1}><Button to="/technical-enquiry" className="mt-14" size="lg">Technical Enquiry</Button></Reveal>
      </div>
    </section>
  );
}
