import Button from '@/components/Button';
import SceneCanvas from '@/animations/SceneCanvas';
import Reveal from '@/animations/Reveal';
import useParallax from '@/animations/useParallax';

export default function FinalCta() {
  const canvasRef = useParallax({ from: -8, to: 8 });
  return (
    <section className="relative overflow-hidden bg-navy-900 py-24 text-white md:py-32">
      <div ref={canvasRef} className="absolute -inset-y-[10%] inset-x-0 opacity-60"><SceneCanvas scene="blend" label="Ingredient particles combining into a blend" /></div>
      <div className="container-page relative text-center">
        <Reveal><h2 className="h-section mx-auto max-w-3xl">Looking for the Right Ingredient for Your Formulation?</h2></Reveal>
        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button to="/request-quote" size="lg">Request a Quote</Button>
            <Button to="/request-sample" variant="outline" size="lg">Request a Sample</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
