// ToDo: This file might be a bit hacky. A raw loader solution / direct native implementation  would be preferable.
export default {
  html: `<div class="content">
    <style>
      html, body { padding: 0; margin: 0; scroll-behavior: smooth; color: #515555; font-size: 32px}

      p { font-family: 'Roboto'; }

      a { text-decoration: none; }

      a:hover { text-decoration: underline; }

      img { max-width: 100%; }

      section, article, main { padding: 2rem 4rem; }

      @media screen and (max-width: 750px) { section, article, main { padding: 1rem 2rem; } }

      ::selection { background-color: #2A9D8F; color: white; }

      blockquote { display: flex; }

      h1:first-child { margin-top: 0.7rem; }

      .headline { font-size: 2rem; }

      .headline.big { font-size: 4rem; }

      .headline.small { font-size: 1.5rem; }

      .flex { display: flex; }

      .flex.vertical { flex-direction: column; }

      .flex.space { justify-content: space-around; }

      .flex.c { justify-content: center; }

      .flex.vertical-c { align-items: center; }

      @media screen and (max-width: 900px) { .flex.mobile-v { flex-direction: column; } }

      .c { text-align: center; }

      .b { font-weight: bold; }

      /* Normalize links */
      a.n { text-decoration: none; color: inherit; }

      a.n:active, a.n:visited, a.n:hover { color: inherit; text-decoration: underline; }

      .button { background-color: #2A9D8F; padding: 0.2rem; margin: 1rem; display: inline-block; text-decoration: none; border-radius: 2rem; }

      .button.big { padding: 0.6rem 1.3rem; font-size: 1.3rem; }

      .button.primary, .button.primary:visited, .button.primary:active { background-color: #2A9D8F; border: 3px solid #2A9D8F; color: white; }

      .button.primary:hover { border: 3px solid #144d46; }

      .button.secondary, .button.secondary:visited, .button.secondary:active { background-color: #F4A261; border: 3px solid #F4A261; color: white; }

      .button.secondary:hover { border: 3px solid #df6b10; }

      .bebas { font-family: 'Bebas Neue'; }

      .roboto { font-family: 'Roboto'; }

      .round { border-radius: 50%; }

      img.portrait { object-fit: cover; width: 150px; height: 150px; }

      img.portrait.big { width: 300px; height: 300px; }

      img.portrait.small { width: 75px; height: 75px; }

      img.sponsor { width: 50%; }

      @media screen and (min-width: 500px) { img.sponsor { width: 30%; } }

      img.border { border: 2px solid white; }

      figcaption.big { font-size: 140%; }

      img.size-sm { width: 3rem; height: 3rem; min-width: 3rem; min-height: 3rem; background-size: cover; }

      img.size-md { width: 6rem; height: 6rem; min-width: 6rem; min-height: 6rem; background-size: cover; }

      img.size-lg { width: 12rem; height: 12rem; min-width: 12rem; min-height: 12rem; background-size: cover; }

      img.size-slg { width: 24rem; height: 24rem; min-width: 24rem; min-height: 24rem; background-size: cover; }

      p.small, span.small { font-size: 0.8rem; }

      p.big, span.big { font-size: 1.5rem; }

      p.xxl, span.xxl { font-size: 2rem; }

      @media screen and (min-width: 900px) { .flex .half { width: 50%; } }

      @media screen and (min-width: 900px) { .flex .third { width: 33.3%; } }

      img.float.left { float: left; margin: 1rem 2rem 1rem 0rem; }

      img.float.right { float: right; margin: 1rem 0rem 1rem 2rem; }

      @media screen and (max-width: 500px) { img.float { display: block; } img.float.left { float: none; margin: 1rem auto 1rem auto; } img.float.right { float: none; margin: 1rem auto 1rem auto; } }

      .first-line { display: flex; justify-content: space-around; }

      .first-line .logo a { color: black; }

      .first-line .logo a:active, .first-line .logo a:visited, .first-line .logo a:hover { color: black; }

      nav { align-self: center; }

      nav ul { list-style: none; padding: 0; }

      nav ul li { display: inline-block; margin: 0 1rem 0 0; }

      @media screen and (max-width: 750px) { nav ul li.no-mobile { display: none; } }

      nav ul li a { color: #2A9D8F; text-decoration: none; font-size: 1.5rem; font-family: "Roboto"; }

      nav ul li a:hover { color: #144d46; text-decoration: underline; }

      @media screen and (max-width: 750px) { .first-line { flex-direction: column; } .first-line .logo { margin: auto; } }

      .ranking { text-align: center; background-color: #e76f51; color: white; font-family: 'Roboto'; padding-top: 2rem; }

      .ranking .title { margin-top: 0; }

      .ranking .info { width: 350px; margin: 0 auto 1rem; display: flex; flex-direction: column; align-items: flex-start; }

      .ranking .info a { color: white; font-weight: bold; text-decoration: underline; }

      .ranking .description { max-width: 350px; text-align: start; white-space: pre-line; }

      .ranking .rank-table { display: flex; align-items: center; justify-content: center; flex-direction: column; }

      .ranking .rank-table__city-list { border-radius: 10px; overflow: hidden; }

      .ranking .list-entry { display: flex; flex-direction: column; align-items: center; color: #515555; }

      .ranking .list-entry__header { display: grid; width: 450px; grid-template-columns: 80px 0 250px 0 120px; align-items: center; padding: 0.5rem; background-color: white; font-size: 1.5rem; border-bottom: 1px solid #e6e6e6; cursor: pointer; }

      @media screen and (max-width: 500px) { .ranking .list-entry__header { width: 350px; grid-template-columns: 80px 0 150px 0 120px; font-size: 1rem; } }

      .ranking .list-entry__header__icon { display: flex; justify-content: center; align-items: center; width: 100%; height: 80px; padding: 0.5rem; box-sizing: border-box; }

      @media screen and (max-width: 500px) { .ranking .list-entry__header__icon { height: 80px; } }

      .ranking .list-entry__details { display: flex; flex-direction: column; align-items: center; width: 100%; padding: 0.5rem; background-color: white; width: 450px; transition: all .5s; }

      @media screen and (max-width: 500px) { .ranking .list-entry__details { font-size: 0.8rem; width: 350px; } }

      .ranking .list-entry__details.shown { position: relative; height: auto; border-top: 1px solid #e6e6e6; border-bottom: 1px solid #e6e6e6; }

      .ranking .list-entry__details.hidden { height: 0; padding: 0 0.5rem; }

      .ranking .check-button { width: 100%; background-color: #e76f51; font-size: 1.5rem; padding: 1rem; color: white; margin-bottom: 1rem; border: none; cursor: pointer; }

      .ranking .contribute-button { width: 100%; background-color: #2A9D8F; font-size: 1.5rem; padding: 1rem; color: white; margin-bottom: 1rem; border: none; cursor: pointer; }

      .ranking .fade-enter-active { animation: expand-in .5s; }

      .ranking .fade-leave-active { animation: expand-in .5s reverse; }

      @keyframes expand-in { 0% { height: 0; }
        100% { height: 300px; } }

      .ranking .key-table, .ranking th, .ranking td { border: 1px solid #e6e6e6; border-collapse: collapse; padding: 0.5rem; }

      .ranking th { min-width: 30%; }

      .ranking .key-table { width: 100%; margin-bottom: 0.5rem; }

      .ranking .key-table__column { display: flex; align-items: flex-start; flex-direction: column; font-weight: normal; text-align: left; font-size: 0.8rem; }

      .ranking .key-table__column__key { font-size: 0.8rem; }

      .ranking .key-table__column__value { font-weight: bold; font-size: 1rem; }

      .ranking .key-table__column .title { font-size: 1rem; }

      .ranking .spacer { height: 50%; border-left: 1px solid #e6e6e6; }

      .ranking .copyright { padding: 0.5rem; }

      .ranking .copyright a { color: white; }

      .contribution { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.3); display: block; overflow-y: auto; font-family: 'Roboto'; }

      @media screen and (max-width: 750px) { .contribution { font-size: 0.8rem; } }

      .contribution__modal { position: relative; margin: 2rem auto; background-color: white; max-width: 600px; min-width: 320px; width: 60%; border-radius: 0.5rem; padding: 1rem; display: flex; flex-direction: column; align-items: center; }

      .contribution__modal .backButton { position: absolute; top: 0.5rem; left: 0.5rem; background-color: transparent; border: none; cursor: pointer; }

      .contribution__modal__title { font-weight: bold; font-size: 2rem; margin-bottom: 0.5rem; }

      .contribution__modal__description { max-width: 400px; margin-bottom: 2rem; }

      .contribution__modal__links { font-weight: bold; }

      .contribution__options { display: flex; flex-direction: column; width: 100%; justify-content: space-evenly; align-items: center; margin: 1rem; }

      .contribution__options > * { width: 100%; max-width: 320px; display: flex; align-items: center; justify-content: space-between; padding: 1rem; color: #515555; text-decoration: none; text-align: right; }

      @media screen and (max-width: 500px) { .contribution__options > * { padding: 0.5rem; } }

      .contribution__options > * > * { width: 50px; border-radius: 0.5rem; box-shadow: 0px 2px 2px 2px #f2f2f2; }

      @media screen and (max-width: 500px) { .contribution__options > * > * { width: 30px; } }

      .ranking-select { background-color: white; border-radius: 0.5rem; box-shadow: 0px 2px 0px 2px #e6e6e6; display: flex; margin: 1rem auto; width: 350px; }

      .ranking-select__button { display: flex; align-items: center; font-weight: bold; flex-grow: 1; justify-content: space-between; margin: 0; padding: 0.5rem 1rem; background-color: transparent; border: none; cursor: pointer; }

      .ranking-select__button svg { font-size: 1.5rem; }

      .ranking-select__button.left { border-top-left-radius: 0.5rem; border-bottom-left-radius: 0.5rem; }

      .ranking-select__button.right { border-top-right-radius: 0.5rem; border-bottom-right-radius: 0.5rem; }

      .ranking-select__button--active { background-color: #f2f2f2; }

      .content { max-width: 900px; margin: auto; }

      #hero .present { background-image: url("../../assets/images/present-bg.svg"); background-repeat: no-repeat; background-size: 85%; background-position: center; padding: 0 2rem; }

      #hero .present img { max-width: 90%; }

      @media screen and (min-width: 900px) { #hero .present { max-width: 80%; } }

      @media screen and (max-width: 900px) { #hero .present { margin-left: -50%; max-height: 20rem; } #hero .present img { max-height: 20rem; } }

      @media screen and (max-width: 500px) { #hero .present { display: none; } #hero .present img { display: none; } }

      section#team { background-color: #2A9D8F; color: white; }

      section#team ::selection { background-color: #F4A261; }

      section#project { background-color: #F4A261; color: white; }

      section#project ::selection { background-color: #2A9D8F; }

      section#contact { background-color: #2A9D8F; color: white; }

      section#contact ::selection { background-color: #F4A261; }

      article h1 { font-size: 2rem; margin-bottom: 1.2rem; }

      article h2 { font-size: 1.8rem; }

      article h3 { font-size: 1.5rem; }

      article .article-infos { margin-top: 0.1rem; margin-bottom: 1.5rem; }

      footer { height: 4rem; color: #2A9D8F; }

      footer a, footer a:hover, footer a:visited, footer a:active { color: #2A9D8F; }

      blockquote { color: #383838; background-color: #ebebeb; font-style: italic; padding: 1rem; margin: 1rem; }

      blockquote p { margin: 0; }

      .pd-sm { padding: 0.5rem; }

      .pd-md { padding: 1rem; }

      .pd-lg { padding: 2rem; }

      .pd-slg { padding: 4rem; }

      .pd-lr-sm { padding-left: 0.5rem; padding-right: 0.5rem; }

      .pd-lr-md { padding-left: 1rem; padding-right: 1rem; }

      .pd-lr-lg { padding-left: 2rem; padding-right: 2rem; }

      .pd-lr-slg { padding-left: 4rem; padding-right: 4rem; }

      .pd-l-sm { padding-left: 0.5rem; }

      .pd-l-md { padding-left: 1rem; }

      .pd-l-lg { padding-left: 2rem; }

      .pd-l-slg { padding-left: 4rem; }

      .pd-r-sm { padding-right: 0.5rem; }

      .pd-r-md { padding-right: 1rem; }

      .pd-r-lg { padding-right: 2rem; }

      .pd-r-slg { padding-right: 4rem; }

      .pd-t-sm { padding-top: 0.5rem; }

      .pd-t-md { padding-top: 1rem; }

      .pd-t-lg { padding-top: 2rem; }

      .pd-t-slg { padding-top: 4rem; }

      .logo { width: 170px; margin: 0.5rem 0 0 0; }
    </style>
    <h1 class="bebas">Impressum</h1>
    <div class="roboto">
      <h2 id="angaben-gemäß--5-tmg">Angaben gemäß § 5 TMG</h2>

      <p>Kapp Prenninger Chilla GbR<br>
      Drostestraße 28<br>
      70499 Stuttgart</p>

      <p><strong>Vertreten durch:</strong><br>
      Alexandra Kapp<br>
      David Prenninger<br>
      Henri Chilla</p>

      <h2 id="kontakt">Kontakt</h2>

      <p>E-Mail: webmaster@cargorocket.de</p>

      <h2 id="verbraucherstreitbeilegunguniversalschlichtungsstelle">Verbraucher­streit­beilegung/Universal­schlichtungs­stelle</h2>

      <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

      <h2 id="haftung-für-inhalte">Haftung für Inhalte</h2>
      <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
      <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>

      <h3 id="haftung-für-links">Haftung für Links</h3>
      <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.</p>
      <p>Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>
      <h3 id="urheberrecht">Urheberrecht</h3>
      <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
      <p>Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>

      <p>Quelle: <a href="https://www.e-recht24.de">eRecht24</a></p>

    </div>
  </div>`,
};
