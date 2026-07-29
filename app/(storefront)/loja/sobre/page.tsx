import Link from "next/link";
import { Award, Eye, Heart, Shield } from "lucide-react";
import { mockStore } from "@/mocks/storefront";

const diferenciais = [
  {
    icon: Eye,
    title: "Exames de vista gratuitos",
    desc: "Realizamos exames completos de acuidade visual sem custo para nossos clientes.",
  },
  {
    icon: Award,
    title: "Marcas premium",
    desc: "Trabalhamos com as melhores marcas nacionais e internacionais do mercado óptico.",
  },
  {
    icon: Heart,
    title: "Atendimento humanizado",
    desc: "Nossa equipe está preparada para entender suas necessidades e oferecer o melhor produto.",
  },
  {
    icon: Shield,
    title: "Garantia e suporte",
    desc: "Todos os produtos possuem garantia e suporte técnico especializado pós-venda.",
  },
];

const equipe = [
  { avatar: "👩‍⚕️", nome: "Dra. Carla Mendes", cargo: "Optometrista CRO 12345" },
  { avatar: "👨‍💼", nome: "Ricardo Alves", cargo: "Gerente de Atendimento" },
  { avatar: "👩‍🔬", nome: "Fernanda Costa", cargo: "Técnica em Óptica" },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen">
      <section
        className="py-16 px-4 text-white text-center"
        style={{
          background: "linear-gradient(135deg, var(--store-primary) 0%, var(--store-secondary) 100%)",
        }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Sobre a {mockStore.name}</h1>
        <p className="text-lg opacity-90 max-w-xl mx-auto">{mockStore.tagline}</p>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nossa história</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            A {mockStore.name} nasceu do sonho de oferecer um atendimento óptico verdadeiramente
            diferenciado no coração de São Paulo. Fundada em 2010, começamos como uma pequena loja de
            bairro com o compromisso de tratar cada cliente como único, entendendo que a visão é um
            dos sentidos mais preciosos que temos.
          </p>
          <p>
            Ao longo de mais de uma década, crescemos e nos tornamos referência em óptica de qualidade
            na região. Investimos continuamente em tecnologia de última geração para exames e
            confecção de lentes, e na capacitação da nossa equipe de especialistas. Hoje, atendemos
            centenas de famílias que confiam na nossa expertise para cuidar da saúde visual de toda a
            família.
          </p>
          <p>
            Acreditamos que uma boa visão transforma vidas. Por isso, além dos produtos premium que
            oferecemos, mantemos um programa de atendimento acessível e parcelamento facilitado para
            que nenhum cliente deixe de cuidar da sua saúde ocular por questões financeiras.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Nossos diferenciais</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {diferenciais.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-5 border border-gray-200 text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: "color-mix(in srgb, var(--store-primary) 12%, white)" }}
                >
                  <Icon className="size-6" style={{ color: "var(--store-primary)" }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Nossa equipe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {equipe.map(({ avatar, nome, cargo }) => (
            <div
              key={nome}
              className="bg-white rounded-xl p-6 border border-gray-200 text-center shadow-sm"
            >
              <div className="text-5xl mb-3">{avatar}</div>
              <h3 className="font-semibold text-gray-900">{nome}</h3>
              <p className="text-sm text-gray-500 mt-1">{cargo}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="py-12 px-4 text-center text-white"
        style={{
          background: "linear-gradient(135deg, var(--store-primary) 0%, var(--store-secondary) 100%)",
        }}
      >
        <h2 className="text-2xl font-bold mb-2">Venha nos visitar</h2>
        <p className="opacity-90 mb-2">{mockStore.address}</p>
        <p className="opacity-80 text-sm mb-6">Seg–Sex 9h–18h · Sáb 9h–13h</p>
        <Link
          href="/loja/contato"
          className="inline-block px-8 py-3 rounded-full font-semibold text-sm bg-white transition-opacity hover:opacity-90"
          style={{ color: "var(--store-primary)" }}
        >
          Entre em contato
        </Link>
      </section>
    </div>
  );
}
