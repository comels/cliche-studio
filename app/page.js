"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Couleurs de fond disponibles (6 couleurs pastel)
const COLORS = [
  "#D6EAF8",
  "#D4EFDF",
  "#FDEBD0",
  "#FDD0D0",
  "#F7D9E3",
  "#E8DAEF",
];

// Liste des marks (logos variables) disponibles
const MARKS = [
  "/mark_1.png",
  "/mark_2.png",
  "/mark_3.png",
  "/mark_4.png",
  "/mark_5.png",
  "/mark_6.png",
  "/mark_7.png",
  "/mark_8.png",
  "/mark_9.png",
];

/**
 * Sélectionne un élément aléatoire dans une liste en évitant la répétition
 * avec la dernière valeur stockée dans localStorage
 * @param {string[]} list - Liste des valeurs possibles
 * @param {string} storageKey - Clé localStorage pour stocker la dernière valeur
 * @returns {string} Élément sélectionné
 */
function pickRandomNoRepeat(list, storageKey) {
  if (typeof window === "undefined") {
    return list[0];
  }

  const lastValue = localStorage.getItem(storageKey);

  // Filtrer la liste pour exclure la dernière valeur (si elle existe)
  const availableOptions = lastValue
    ? list.filter((item) => item !== lastValue)
    : list;

  // Si la liste filtrée est vide (cas improbable), utiliser la liste complète
  const optionsToUse = availableOptions.length > 0 ? availableOptions : list;

  // Sélectionner aléatoirement dans les options disponibles
  const selected =
    optionsToUse[Math.floor(Math.random() * optionsToUse.length)];

  // Sauvegarder IMMÉDIATEMENT la nouvelle valeur dans localStorage
  // pour éviter les répétitions si la fonction est appelée plusieurs fois rapidement
  localStorage.setItem(storageKey, selected);

  return selected;
}

export default function Home() {
  // États - Initialisation avec valeurs par défaut pour éviter l'erreur d'hydratation
  const [bgColor, setBgColor] = useState(COLORS[0]);
  const [markSrc, setMarkSrc] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const menuContentRef = useRef(null);

  // Initialisation : sélection aléatoire de la couleur de fond et du mark
  // Utilisation d'un useEffect pour éviter l'erreur d'hydratation SSR/CSR
  useEffect(() => {
    setIsMounted(true);

    // Sélectionner les nouvelles valeurs (la fonction exclut déjà la dernière)
    const color = pickRandomNoRepeat(COLORS, "lastBgColor");
    const mark = pickRandomNoRepeat(MARKS, "lastMark");

    setBgColor(color);
    setMarkSrc(mark);
  }, []);

  // Calculer la largeur de la scrollbar du menu pour aligner le burger avec le texte
  useEffect(() => {
    if (!isMenuOpen || !menuContentRef.current) {
      setScrollbarWidth(0);
      return;
    }

    const calculateScrollbarWidth = () => {
      const menuContent = menuContentRef.current;
      if (!menuContent) return;

      // Vérifier si le contenu dépasse (scrollbar visible)
      const hasScrollbar = menuContent.scrollHeight > menuContent.clientHeight;

      if (hasScrollbar) {
        const width = menuContent.offsetWidth - menuContent.clientWidth;
        setScrollbarWidth(width);
      } else {
        setScrollbarWidth(0);
      }
    };

    // Utiliser ResizeObserver pour détecter les changements de taille
    const resizeObserver = new ResizeObserver(calculateScrollbarWidth);
    resizeObserver.observe(menuContentRef.current);

    // Calcul initial avec un petit délai pour s'assurer que le menu est rendu
    const timeoutId = setTimeout(calculateScrollbarWidth, 100);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [isMenuOpen]);

  // Gestion de la touche ESC pour fermer le menu
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  // Handlers optimisés avec useCallback
  const handleOverlayClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleMenuPanelClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleMenuContentClick = useCallback((e) => {
    // Ne pas fermer si on clique sur le contenu texte (about, services, adresse, etc.)
    const target = e.target;
    const isTextContent =
      target.tagName === "P" ||
      target.tagName === "H2" ||
      target.tagName === "UL" ||
      target.tagName === "LI" ||
      target.tagName === "A" ||
      target.closest("p, h2, ul, li, a");

    if (!isTextContent) {
      // Si on clique en dehors du contenu texte, fermer le menu
      setIsMenuOpen(false);
    } else {
      // Sinon, empêcher la propagation pour ne pas fermer
      e.stopPropagation();
    }
  }, []);

  return (
    <div
      className="h-screen w-screen md:overflow-hidden relative"
      style={{
        backgroundColor: bgColor,
        height: "100vh",
        height: "100dvh", // Dynamic viewport height pour mobile (iOS)
      }}
    >
      {/* Bouton burger - Visible avec opacité réduite quand le menu est ouvert */}
      <button
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen(!isMenuOpen);
        }}
        className={`absolute top-6 z-[60] transition-all duration-[1500ms] ${
          isMenuOpen ? "opacity-15" : "opacity-100"
        }`}
        style={{
          right:
            isMenuOpen && scrollbarWidth > 0
              ? `calc(1.5rem + ${scrollbarWidth}px)`
              : "1.5rem",
        }}
      >
        <img src="/burger.png" alt="Menu" className="w-7 h-3" />
      </button>

      {/* Layout principal : 2 moitiés (gauche/droite) */}
      <div
        className={`h-full w-full flex ${
          isMenuOpen ? "overflow-y-auto md:overflow-hidden" : "overflow-hidden"
        }`}
      >
        {/* Moitié gauche - Bloc Logo */}
        {isMounted && markSrc && (
          <div
            className="w-full md:w-1/2 flex items-center justify-center md:justify-end"
            style={{
              height: "100vh",
              height: "100dvh", // Dynamic viewport height pour mobile (iOS)
              minHeight: "100vh",
              minHeight: "100dvh",
            }}
          >
            <div
              className={`transition-opacity duration-[1500ms] select-none ${
                isMenuOpen ? "opacity-0 md:opacity-15" : "opacity-100"
              }`}
            >
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 lg:gap-9 xl:gap-12 select-none">
                <img
                  src="/logo.png"
                  alt="Logo Cliché Studio"
                  className="logo-main h-auto object-contain select-none pointer-events-none"
                />
                <img
                  src={markSrc}
                  alt="Mark"
                  className="logo-mark h-auto object-contain select-none pointer-events-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Moitié droite - Espace vide (desktop uniquement) */}
        <div className="hidden md:block w-1/2 h-full" />
      </div>

      {/* Overlay transparent pour fermer le menu au clic extérieur */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-transparent z-40"
          onClick={handleOverlayClick}
        />
      )}

      {/* Panneau du menu - Slide depuis la droite */}
      <div
        className={`fixed top-0 right-0 h-full z-50 transition-all duration-[1500ms] ease-in-out w-full md:w-1/2 flex ${
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
        onClick={handleMenuPanelClick}
      >
        {/* Contenu du menu avec animation d'opacité */}
        <div
          ref={menuContentRef}
          className={`h-full flex flex-col justify-between text-right p-6 py-12 md:max-w-[600px] 3xl:max-w-3xl md:pl-12 md:ml-auto overflow-y-auto menu-content transition-opacity duration-[1500ms] ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleMenuContentClick}
        >
          {/* Section About */}
          <div>
            <p className="text-xs 3xl:text-base mt-1 mb-12 text-justify">
              Cliché Studio is a high-end photographic post-production agency
              specializing in digital and e-commerce imagery, founded in 2025 in
              Bali by Xavier Cariou and Bastien Constant.
              <br />
              Born from the convergence of two complementary expertises, the
              studio delivers refined visual solutions to the fashion, luxury,
              and advertising industries.
              <br />
              Founder of the Paris-based studio Artifices, Xavier Cariou has
              collaborated for over a decade with leading fashion and luxury
              houses, international magazines, and global publishers. Alongside
              him, Bastien Constant brings over 20 years of experience as a
              senior retoucher, developed within several Parisian studios and
              renowned advertising agencies specializing in fashion imagery and
              advertising photography.
              <br />
              By combining their respective experiences and networks, they have
              established an agile and international structure designed to
              support the evolving needs of global brands.
              <br />
              Based in Bali, Cliché Studio operates as a flexible and reliable
              partner, capable of delivering high-quality digital visual content
              tailored to the demanding pace of e-commerce and contemporary
              online marketing.
            </p>
          </div>

          {/* Sections du menu (Services, Follow, Contact, Address) */}
          <div className="space-y-6 md:space-y-8">
            {/* Services */}
            <div className="flex justify-between">
              <h2 className="text-xs 3xl:text-base">services</h2>
              <ul className="text-xs 3xl:text-base">
                <li>High-end Retouching</li>
                <li>Color Grading & Finishing</li>
                <li>Compositing</li>
                <li>E-commerce</li>
                <li>Delivery & Archiving</li>
              </ul>
            </div>

            {/* Follow - Réseaux sociaux */}
            <div className="flex justify-between">
              <h2 className="text-xs 3xl:text-base">follow</h2>
              <ul className="text-xs 3xl:text-base flex gap-4">
                <li>
                  <a
                    href="https://www.instagram.com/cliche.studio_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/clich%C3%A9-studio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="flex justify-between">
              <h2 className="text-xs 3xl:text-base">contact</h2>
              <p className="text-xs 3xl:text-base">
                <a
                  href="mailto:contact@cliche-studio.com"
                  className="underline"
                >
                  contact@cliche-studio.com
                </a>
              </p>
            </div>

            {/* Address */}
            <div>
              <p className="text-xs 3xl:text-base">
                Jl. Mertanadi No.31, Kerobokan Kelod, <br /> Kec. Kuta Utara,
                Kabupaten Badung, <br /> Bali 80361
                <br />
                <span className="italic mt-4 block">By appointment only.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
