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
  <h1 class="bebas">Datenschutzerklärung</h1>
  <div class="roboto">
      <h2 id="verantwortlich">Verantwortlich</h2>
  <p>Der Verantwortliche im Sinne der Datenschutz-Grundverordnung und anderer nationaler Datenschutzgesetze der Mitgliedsstaaten sowie sonstiger datenschutzrechtlicher Bestimmungen ist die:</p>

  <ul>
  <li>Kapp Prenninger Chilla GbR</li>
  <li>Drostestraße 28</li>
  <li>70499 Stuttgart</li>
  <li>Mail: webmaster@cargorocket.de</li>
  </ul>

  <h2 id="name-und-anschrift-des-datenschutzbeauftragten">Name und Anschrift des Datenschutzbeauftragten</h2>
  <p>Die Datenschutzbeauftragte des Verantwortlichen ist:</p>

  <ul>
  <li>Alexandra Kapp</li>
  <li>Drostestraße 28</li>
  <li>70499 Stuttgart</li>
  <li>Mail: datenschutz@cargorocket.de</li>
  </ul>

  <h2 id="allgemeines-zur-datenverarbeitung">Allgemeines zur Datenverarbeitung</h2>
  <h3 id="umfang-der-verarbeitung-personenbezogener-daten">Umfang der Verarbeitung personenbezogener Daten</h3>
  <p>Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung personenbezogener Daten unserer Nutzer erfolgt regelmäßig nur nach Einwilligung des Nutzers. Eine Ausnahme gilt in solchen Fällen, in denen eine vorherige Einholung einer Einwilligung aus tatsächlichen Gründen nicht möglich ist und die Verarbeitung der Daten durch gesetzliche Vorschriften gestattet ist.</p>

  <h3 id="rechtsgrundlage-für-die-verarbeitung-personenbezogener-daten">Rechtsgrundlage für die Verarbeitung personenbezogener Daten</h3>
  <p>Soweit wir für Verarbeitungsvorgänge personenbezogener Daten eine Einwilligung der betroffenen Person einholen, dient Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;a EU-Datenschutzgrundverordnung (DSGVO) als Rechtsgrundlage.
  Bei der Verarbeitung von personenbezogenen Daten, die zur Erfüllung eines Vertrages, dessen Vertragspartei die betroffene Person ist, erforderlich ist, dient Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO als Rechtsgrundlage. Dies gilt auch für Verarbeitungsvorgänge, die zur Durchführung vorvertraglicher Maßnahmen erforderlich sind.
  Soweit eine Verarbeitung personenbezogener Daten zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist, der unser Unternehmen unterliegt, dient Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;c DSGVO als Rechtsgrundlage.
  Für den Fall, dass lebenswichtige Interessen der betroffenen Person oder einer anderen natürlichen Person eine Verarbeitung personenbezogener Daten erforderlich machen, dient Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;d DSGVO als Rechtsgrundlage.
  Ist die Verarbeitung zur Wahrung eines berechtigten Interesses unseres Unternehmens oder eines Dritten erforderlich und überwiegen die Interessen, Grundrechte und Grundfreiheiten des Betroffenen das erstgenannte Interesse nicht, so dient Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO als Rechtsgrundlage für die Verarbeitung.</p>

  <h3 id="datenlöschung-und-speicherdauer">Datenlöschung und Speicherdauer</h3>
  <p>Die personenbezogenen Daten der betroffenen Person werden gelöscht oder gesperrt, sobald der Zweck der Speicherung entfällt. Eine Speicherung kann darüber hinaus erfolgen, wenn dies durch den europäischen oder nationalen Gesetzgeber in unionsrechtlichen Verordnungen, Gesetzen oder sonstigen Vorschriften, denen der Verantwortliche unterliegt, vorgesehen wurde. Eine Sperrung oder Löschung der Daten erfolgt auch dann, wenn eine durch die genannten Normen vorgeschriebene Speicherfrist abläuft, es sei denn, dass eine Erforderlichkeit zur weiteren Speicherung der Daten für einen Vertragsabschluss oder eine Vertragserfüllung besteht.</p>

  <h2 id="bereitstellung-der-website-und-erstellung-von-logfiles">Bereitstellung der Website und Erstellung von Logfiles</h2>
  <h3 id="beschreibung-und-umfang-der-datenverarbeitung">Beschreibung und Umfang der Datenverarbeitung</h3>
  <p>Bei jedem Aufruf unserer Internetseite erfasst unser System automatisiert Daten und Informationen vom Computersystem des aufrufenden Rechners. 
  Folgende Daten werden hierbei erhoben:</p>

  <ul>
  <li>Die IP-Adresse der Nutzerin/ des Nutzers</li>
  <li>Datum und Uhrzeit des Zugriffs</li>
  <li>Websites, von denen das System des Nutzers auf unsere Internetseite gelangt</li>
  <li>Websites, die vom System des Nutzers über unsere Website aufgerufen werden</li>
  </ul>

  <p>Die Daten werden ebenfalls in den Logfiles unseres Systems gespeichert. Eine Speicherung dieser Daten zusammen mit anderen personenbezogenen Daten des Nutzers findet nicht statt.</p>

  <h3 id="rechtsgrundlage-für-die-datenverarbeitung">Rechtsgrundlage für die Datenverarbeitung</h3>
  <p>Rechtsgrundlage für die vorübergehende Speicherung der Daten und der Logfiles ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO.</p>

  <h4 id="zweck-der-datenverarbeitung">Zweck der Datenverarbeitung</h4>
  <p>Die vorübergehende Speicherung der IP-Adresse durch das System ist notwendig, um eine Auslieferung der Website an den Rechner des Nutzers zu ermöglichen. Hierfür muss die IP-Adresse des Nutzers für die Dauer der Sitzung gespeichert bleiben.</p>

  <p>Die Speicherung in Logfiles erfolgt, um die Funktionsfähigkeit der Website sicherzustellen. Zudem dienen uns die Daten zur Optimierung der Website und zur Sicherstellung der Sicherheit unserer informationstechnischen Systeme. Eine Auswertung der Daten zu Marketingzwecken findet in diesem Zusammenhang nicht statt.</p>

  <p>In diesen Zwecken liegt auch unser berechtigtes Interesse an der Datenverarbeitung nach Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO.</p>

  <h3 id="dauer-der-speicherung">Dauer der Speicherung</h3>
  <p>Die Daten werden gelöscht, sobald sie für die Erreichung des Zweckes ihrer Erhebung nicht mehr erforderlich sind. Im Falle der Erfassung der Daten zur Bereitstellung der Website ist dies der Fall, wenn die jeweilige Sitzung beendet ist.</p>

  <p>Im Falle der Speicherung der Daten in Logfiles ist dies nach spätestens sieben Tagen der Fall. Eine darüberhinausgehende Speicherung ist möglich. In diesem Fall werden die IP-Adressen der Nutzer gelöscht oder verfremdet, sodass eine Zuordnung des aufrufenden Clients nicht mehr möglich ist.</p>

  <h3 id="widerspruchs--und-beseitigungsmöglichkeit">Widerspruchs- und Beseitigungsmöglichkeit</h3>
  <p>Die Erfassung der Daten zur Bereitstellung der Website und die Speicherung der Daten in Logfiles ist für den Betrieb der Internetseite zwingend erforderlich. Es besteht folglich seitens des Nutzers keine Widerspruchsmöglichkeit.</p>

  <h2 id="kontaktformular-und-e-mail-kontakt">Kontaktformular und E-Mail-Kontakt</h2>
  <h3 id="beschreibung-und-umfang-der-datenverarbeitung-1">Beschreibung und Umfang der Datenverarbeitung</h3>
  <p>Es ist eine Kontaktaufnahme über die bereitgestellte E-Mail-Adresse möglich. In diesem Fall werden die mit der E-Mail übermittelten personenbezogenen Daten des Nutzers gespeichert.</p>

  <p>Es erfolgt in diesem Zusammenhang keine Weitergabe der Daten an Dritte. Die Daten werden ausschließlich für die Verarbeitung der Konversation verwendet.</p>
  <h2 id="rechtsgrundlage-für-die-datenverarbeitung-1">Rechtsgrundlage für die Datenverarbeitung</h2>
  <p>Rechtsgrundlage für die Verarbeitung der Daten ist bei Vorliegen einer Einwilligung des Nutzers Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;a DSGVO.</p>

  <p>Rechtsgrundlage für die Verarbeitung der Daten, die im Zuge einer Übersendung einer E-Mail übermittelt werden, ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO. Zielt der E-Mail-Kontakt auf den Abschluss eines Vertrages ab, so ist zusätzliche Rechtsgrundlage für die Verarbeitung Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO.</p>

  <h3 id="zweck-der-datenverarbeitung-1">Zweck der Datenverarbeitung</h3>
  <p>Die Verarbeitung der personenbezogenen Daten durch die Kontaktaufnahme per E-Mail liegt hieran das erforderliche berechtigte Interesse an der Verarbeitung der Daten.
  Die sonstigen während des Absendevorgangs verarbeiteten personenbezogenen Daten dienen dazu, einen Missbrauch des Kontaktformulars zu verhindern und die Sicherheit unserer informationstechnischen Systeme sicherzustellen.</p>

  <h3 id="dauer-der-speicherung-1">Dauer der Speicherung</h3>
  <p>Die Daten werden gelöscht, sobald sie für die Erreichung des Zweckes ihrer Erhebung nicht mehr erforderlich sind. Für die personenbezogenen Daten aus der Eingabemaske des Kontaktformulars und diejenigen, die per E-Mail übersandt wurden, ist dies dann der Fall, wenn die jeweilige Konversation mit dem Nutzer beendet ist. Beendet ist die Konversation dann, wenn sich aus den Umständen entnehmen lässt, dass der betroffene Sachverhalt abschließend geklärt ist.</p>

  <p>Die während des Absendevorgangs zusätzlich erhobenen personenbezogenen Daten werden spätestens nach einer Frist von sieben Tagen gelöscht.</p>
  <h3 id="widerspruchs--und-beseitigungsmöglichkeit-1">Widerspruchs- und Beseitigungsmöglichkeit</h3>
  <p>Der Nutzer hat jederzeit die Möglichkeit, seine Einwilligung zur Verarbeitung der personenbezogenen Daten zu widerrufen. Nimmt der Nutzer per E-Mail Kontakt mit uns auf, so kann er der Speicherung seiner personenbezogenen Daten jederzeit widersprechen. In einem solchen Fall kann die Konversation nicht fortgeführt werden.</p>

  <p>Alle personenbezogenen Daten, die im Zuge der Kontaktaufnahme gespeichert wurden, werden in diesem Fall gelöscht.</p>

  </div>
  </div>`,
};
