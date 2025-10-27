import React from "react";
import "./TermsModel.css";

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Termos de Uso – Eventura</h2>
        <p className="update-date">Última atualização: 26 de outubro de 2025</p>

        <div className="modal-scroll">
          <h3>1. Definições</h3>
          <p>
            Para melhor compreensão destes Termos:
            <br />
            <strong>Usuário</strong>: pessoa física que cria conta ou acessa o Eventura;
            <br />
            <strong>Organizador</strong>: usuário que cria e publica eventos;
            <br />
            <strong>Participante</strong>: usuário que consulta, curte ou comenta eventos;
            <br />
            <strong>Conteúdo</strong>: qualquer informação, texto ou imagem publicada;
            <br />
            <strong>Plataforma</strong>: conjunto de serviços e funcionalidades do Eventura.
          </p>

          <h3>2. Objeto</h3>
          <p>
            O <strong>Eventura</strong> tem como objetivo divulgar eventos da cidade de
            Uberaba, permitindo que organizadores registrem suas atividades e que
            participantes descubram novas experiências culturais, esportivas e sociais.
          </p>

          <h3>3. Condições de Cadastro e Uso</h3>
          <ul>
            <li>O uso é permitido a pessoas com 16 anos ou mais.</li>
            <li>
              Menores de idade devem utilizar a plataforma sob supervisão de um
              responsável.
            </li>
            <li>
              O usuário se compromete a fornecer informações verdadeiras, completas e
              atualizadas.
            </li>
            <li>
              O Eventura poderá suspender ou excluir contas que violem estes Termos ou
              insiram dados falsos.
            </li>
            <li>
              É proibido o uso para fins comerciais não autorizados, spam ou divulgação
              de conteúdos ilegais.
            </li>
          </ul>

          <h3>4. Responsabilidades do Usuário</h3>
          <ul>
            <li>Utilizar o Eventura apenas para fins legítimos e éticos;</li>
            <li>
              Não publicar conteúdo ofensivo, difamatório, discriminatório ou ilegal;
            </li>
            <li>Respeitar direitos autorais e de imagem de terceiros;</li>
            <li>
              Assumir total responsabilidade pelo conteúdo publicado ou compartilhado.
            </li>
          </ul>

          <h3>5. Limitação de Responsabilidade</h3>
          <p>
            O Eventura atua apenas como meio de divulgação de eventos e não se
            responsabiliza por:
          </p>
          <ul>
            <li>Veracidade das informações fornecidas por organizadores;</li>
            <li>Realização, cancelamento ou qualidade dos eventos;</li>
            <li>
              Danos ou prejuízos decorrentes da participação em eventos divulgados.
            </li>
          </ul>

          <h3>6. Propriedade Intelectual</h3>
          <p>
            Todo o design, código, logotipo e layout do Eventura são protegidos por
            direitos autorais e pertencem à equipe de desenvolvimento.
          </p>
          <p>
            Os conteúdos publicados por usuários permanecem de sua autoria, mas o
            usuário concede ao Eventura uma licença gratuita e não exclusiva para
            exibir e armazenar esse conteúdo dentro da plataforma.
          </p>

          <h3>7. Privacidade e Proteção de Dados</h3>
          <p>
            O Eventura trata dados pessoais conforme a
            <strong>
              {" "}
              Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018)
            </strong>
            .
          </p>
          <ul>
            <li>
              <strong>Dados coletados:</strong> nome, e-mail, telefone e senha
              criptografada;
            </li>
            <li>
              <strong>Finalidade:</strong> autenticação e gerenciamento de eventos;
            </li>
            <li>
              <strong>Base legal:</strong> consentimento do usuário;
            </li>
            <li>
              <strong>Compartilhamento:</strong> não há compartilhamento com terceiros,
              salvo obrigação legal;
            </li>
            <li>
              <strong>Retenção:</strong> enquanto a conta estiver ativa ou conforme
              exigências legais.
            </li>
          </ul>
          <p>
            Para mais informações, consulte nossa Política de Privacidade (documento
            complementar).
          </p>

          <h3>8. Remoção de Conteúdo</h3>
          <p>
            O Eventura poderá remover qualquer conteúdo que viole estes Termos, a LGPD
            ou legislação vigente, ou que contenha discurso de ódio, violência,
            discriminação ou spam. Usuários reincidentes poderão ter suas contas
            suspensas.
          </p>

          <h3>9. Atualizações dos Termos</h3>
          <p>
            O Eventura poderá alterar estes Termos a qualquer momento. O uso contínuo
            da plataforma após modificações será considerado aceite tácito das novas
            condições.
          </p>

          <h3>10. Contato</h3>
          <p>
            Dúvidas ou solicitações podem ser enviadas para:{" "}
            <a href="mailto:suporte.eventura@gmail.com">
              suporte.eventura@gmail.com
            </a>
          </p>

          <h3>11. Lei Aplicável e Foro</h3>
          <p>
            Estes Termos são regidos pelas leis da República Federativa do Brasil, sendo
            eleito o foro da <strong>Comarca de Uberaba/MG</strong> para resolução de
            eventuais disputas.
          </p>

          <h3>Declaração de Concordância</h3>
          <p>
            Ao marcar a opção <strong>“Li e concordo com os Termos de Uso”</strong> e
            criar uma conta, o usuário declara estar ciente de todas as condições acima
            e autoriza o tratamento de seus dados conforme descrito.
          </p>
        </div>

        <div className="modal-actions">
          <button className="btn-close" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
