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

// Liste des marks (logos variables) pour mobile
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

// Liste des logos pour desktop (dossier logo-ordi)
const LOGOS_DESKTOP = [
  "/logo-ordi/mark_01.png",
  "/logo-ordi/mark_02.png",
  "/logo-ordi/mark_03.png",
  "/logo-ordi/mark_04.png",
  "/logo-ordi/mark_05.png",
  "/logo-ordi/mark_06.png",
  "/logo-ordi/mark_07.png",
  "/logo-ordi/mark_08.png",
  "/logo-ordi/mark_09.png",
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

  // Lire la dernière valeur AVANT toute sélection
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
  // AVANT de retourner pour éviter les répétitions si la fonction est appelée plusieurs fois
  try {
    localStorage.setItem(storageKey, selected);
  } catch (e) {
    // En cas d'erreur localStorage (quota, etc.), continuer quand même
    console.warn("localStorage error:", e);
  }

  return selected;
}

export default function Home() {
  // États - Initialisation avec valeurs par défaut pour éviter l'erreur d'hydratation
  const [bgColor, setBgColor] = useState(COLORS[0]);
  const [markSrc, setMarkSrc] = useState(null);
  const [logoSrcDesktop, setLogoSrcDesktop] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const menuContentRef = useRef(null);
  const initializedRef = useRef(false); // Pour éviter les doubles initialisations

  // Initialisation : sélection aléatoire de la couleur de fond et des logos
  // Utilisation d'un useEffect pour éviter l'erreur d'hydratation SSR/CSR
  useEffect(() => {
    // Éviter les doubles initialisations (React StrictMode en développement)
    if (initializedRef.current) return;
    initializedRef.current = true;

    setIsMounted(true);

    // Sélectionner les nouvelles valeurs (la fonction exclut déjà la dernière)
    const color = pickRandomNoRepeat(COLORS, "lastBgColor");
    const mark = pickRandomNoRepeat(MARKS, "lastMark");
    const logoDesktop = pickRandomNoRepeat(LOGOS_DESKTOP, "lastLogoDesktop");

    setBgColor(color);
    setMarkSrc(mark);
    setLogoSrcDesktop(logoDesktop);
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
        <img
          src="/burger.png"
          alt="Open menu"
          className="w-7 h-3"
          loading="eager"
        />
      </button>

      {/* Layout principal : 2 moitiés (gauche/droite) */}
      <div
        className={`h-full w-full flex ${
          isMenuOpen ? "overflow-y-auto md:overflow-hidden" : "overflow-hidden"
        }`}
      >
        {/* Moitié gauche - Bloc Logo */}
        {isMounted && (markSrc || logoSrcDesktop) && (
          <div
            className="w-full md:w-1/2 flex items-center justify-center md:items-center md:justify-end relative"
            style={{
              height: "100vh",
              height: "100dvh", // Dynamic viewport height pour mobile (iOS)
              minHeight: "100vh",
              minHeight: "100dvh",
            }}
          >
            {/* Mobile : Logo + Mark */}
            {markSrc && (
              <div
                className={`flex flex-col md:hidden items-center gap-3 select-none transition-opacity duration-[1500ms] ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              >
                <img
                  src="/logo.png"
                  alt="Cliché Studio - High-end Retouching Post-Production Agency"
                  className="logo-main h-auto object-contain select-none pointer-events-none"
                  loading="eager"
                  fetchPriority="high"
                />
                <img
                  src={markSrc}
                  alt="Cliché Studio Mark"
                  className="logo-mark h-auto object-contain select-none pointer-events-none"
                  loading="eager"
                />
              </div>
            )}
            {/* Desktop : Logo seul du dossier logo-ordi */}
            {logoSrcDesktop && (
              <div
                className={`hidden md:flex md:justify-end md:items-center select-none transition-opacity duration-[1500ms] ${
                  isMenuOpen ? "opacity-15" : "opacity-100"
                }`}
                style={{ width: "fit-content" }}
              >
                <img
                  src={logoSrcDesktop}
                  alt="Cliché Studio Logo"
                  className="h-auto w-[80%] object-contain select-none pointer-events-none"
                  loading="eager"
                />
              </div>
            )}
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
          className={`h-full flex flex-col justify-between text-right p-6 py-12 md:max-w-[550px] 2xl:max-w-[600px] md:pl-12 md:ml-auto overflow-y-auto menu-content transition-opacity duration-[1500ms] ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleMenuContentClick}
        >
          {/* Section About */}
          <div>
            <p className="text-xs mt-1 mb-12 text-justify">
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
              <h2 className="text-xs">services</h2>
              <ul className="text-xs">
                <li>High-end Retouching</li>
                <li>Color Grading & Finishing</li>
                <li>Compositing</li>
                <li>E-commerce</li>
                <li>Delivery & Archiving</li>
              </ul>
            </div>

            {/* Follow - Réseaux sociaux */}
            <div className="flex justify-between">
              <h2 className="text-xs">follow</h2>
              <ul className="text-xs flex gap-4">
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
              <h2 className="text-xs">contact</h2>
              <p className="text-xs">
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
              <p className="text-xs">
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
