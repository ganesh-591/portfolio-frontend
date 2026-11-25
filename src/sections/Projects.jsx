import React, {
    useRef,
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
    useId
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    ArrowUpRight,
    ArrowLeft,
    ArrowRight,
    Code2
} from "lucide-react";
import "./Projects.css";

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        number: "01",
        category: "FULL STACK APPLICATION",
        title: "Academic Management System",
        subtitle: "Enterprise Learning & Campus Management Platform",
        description:
            "A high-throughput enterprise academic platform architected with Spring Boot microservices, Spring Security RBAC, and React.js. Features 9 core operational modules including automated exam evaluation, course scheduling, batch enrollment, and live webinar streaming.",
        modules: [
            "Course & Content Management",
            "Batch & Enrollment",
            "Attendance",
            "Examination & Grading",
            "Certificates",
            "Student Dashboard",
            "Instructor View",
            "Webinars",
            "Inventory & Stock"
        ],
        tech: [
            "Java 21",
            "Spring Boot",
            "React.js",
            "MySQL",
            "Hibernate",
            "REST APIs"
        ],
        featured: true,
        github: "https://github.com/ganesh-591",
        icons: [
            {
                label: "Java 21",
                src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
                background: "linear-gradient(135deg, #2b2b2b, #141414)"
            },
            {
                label: "Spring Boot",
                src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg",
                background: "linear-gradient(135deg, #1b3320, #0f1f14)"
            },
            {
                label: "React.js",
                src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
                background: "linear-gradient(135deg, #152b3c, #0c1822)"
            },
            {
                label: "MySQL",
                src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
                background: "linear-gradient(135deg, #1a2936, #0d161e)"
            },
            {
                label: "Hibernate",
                src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/hibernate/hibernate-original.svg",
                background: "linear-gradient(135deg, #2c2518, #18140c)"
            }
        ]
    },
    {
        number: "02",
        category: "FRONTEND DEVELOPMENT",
        title: "Job Application Portal",
        subtitle: "Web Application",
        description:
            "A frontend project focused on presenting job opportunities and creating a clean, accessible application interface.",
        tech: ["HTML5", "CSS3", "JavaScript", "React.js"],
        featured: false,
        icons: [
            {
                label: "HTML5",
                src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
                background: "linear-gradient(135deg, #3d2215, #1f110a)"
            },
            {
                label: "CSS3",
                src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
                background: "linear-gradient(135deg, #152b3c, #0c1720)"
            },
            {
                label: "JavaScript",
                src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
                background: "linear-gradient(135deg, #383112, #1c1808)"
            },
            {
                label: "React.js",
                src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
                background: "linear-gradient(135deg, #152b3c, #0c1822)"
            }
        ]
    },
    {
        number: "03",
        category: "FRONTEND DEVELOPMENT",
        title: "E-commerce Storefront",
        subtitle: "Web Application",
        description:
            "A static e-commerce storefront demonstrating product presentation and modern web interface design.",
        tech: ["HTML5", "CSS3", "JavaScript"],
        featured: false,
        icons: [
            {
                label: "HTML5",
                src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
                background: "linear-gradient(135deg, #3d2215, #1f110a)"
            },
            {
                label: "CSS3",
                src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
                background: "linear-gradient(135deg, #152b3c, #0c1720)"
            },
            {
                label: "JavaScript",
                src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
                background: "linear-gradient(135deg, #383112, #1c1808)"
            }
        ]
    }
];

/* Folder tab outlines: front pocket tab on left, back plate tab on right */
const pathL = (w, h, r = 24, d = 24, tw = Math.round(w * 0.44), s = 46) =>
    `M0 ${r}A${r} ${r} 0 0 1 ${r} 0L${tw} 0C${tw + s * 0.55} 0 ${tw + s * 0.45} ${d} ${tw + s} ${d}L${w - r} ${d}A${r} ${r} 0 0 1 ${w} ${d + r}L${w} ${h - r}A${r} ${r} 0 0 1 ${w - r} ${h}L${r} ${h}A${r} ${r} 0 0 1 0 ${h - r}Z`;

const pathR = (w, h, r = 24, d = 24, tw = Math.round(w * 0.42), s = 46) => {
    const x = w - tw;
    return `M0 ${d + r}A${r} ${r} 0 0 1 ${r} ${d}L${x - s} ${d}C${x - s * 0.45} ${d} ${x - s * 0.55} 0 ${x} 0L${w - r} 0A${r} ${r} 0 0 1 ${w} ${r}L${w} ${h - r}A${r} ${r} 0 0 1 ${w - r} ${h}L${r} ${h}A${r} ${r} 0 0 1 0 ${h - r}Z`;
};

function useShape(ref, makePath, defaultW = 540, defaultH = 260) {
    const [pathD, setPathD] = useState(() => makePath(defaultW, defaultH));

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const update = () => {
            const w = el.offsetWidth || defaultW;
            const h = el.offsetHeight || defaultH;
            setPathD(makePath(w, h));
        };

        update();

        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [ref, makePath, defaultW, defaultH]);

    return pathD;
}

function ProjectFolderCard({ project, active, onSelect }) {
    const rawId = useId();
    const id = rawId.replace(/:/g, "");

    const frontRef = useRef(null);
    const backRef = useRef(null);

    const [isHovered, setIsHovered] = useState(false);
    const [hoveredIconIndex, setHoveredIconIndex] = useState(null);

    const frontD = useShape(frontRef, (w, h) => pathL(w, h, 24, 24, Math.round(w * 0.44), 46), 540, 275);
    const backD = useShape(backRef, (w, h) => pathR(w, h, 24, 24, Math.round(w * 0.42), 46), 540, 365);

    const icons = project.icons;
    const n = icons.length;
    const rs = n > 1 ? 24 / (n - 1) : 0;
    const spread = 72;
    const wide = isHovered || active;

    const activeHoveredLabel =
        hoveredIconIndex !== null ? icons[hoveredIconIndex]?.label : null;

    return (
        <div
            className={`project-folder-wrapper ${active ? "is-active" : "is-inactive"}`}
            onClick={!active && onSelect ? onSelect : undefined}
            onPointerEnter={(e) => e.pointerType === "mouse" && setIsHovered(true)}
            onPointerLeave={() => {
                setIsHovered(false);
                setHoveredIconIndex(null);
            }}
            role={active ? "region" : "button"}
            tabIndex={active ? 0 : -1}
            aria-label={`${project.title} folder`}
        >
            {/* SVG Defs for crisp vector clip-paths */}
            <svg width="0" height="0" className="folder-clip-defs" aria-hidden="true">
                <defs>
                    <clipPath id={`clip-front-${id}`} clipPathUnits="userSpaceOnUse">
                        <path d={frontD} />
                    </clipPath>
                    <clipPath id={`clip-back-${id}`} clipPathUnits="userSpaceOnUse">
                        <path d={backD} />
                    </clipPath>
                    <linearGradient id={`edge-front-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--folder-edge-top, rgba(255, 255, 255, 0.42))" />
                        <stop offset="35%" stopColor="var(--folder-edge-mid, rgba(255, 255, 255, 0.12))" />
                        <stop offset="100%" stopColor="var(--folder-edge-bot, rgba(255, 255, 255, 0))" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Back Glow */}
            <div className="folder-back-glow" aria-hidden="true" />

            {/* Back Plate with right-hand tab */}
            <div
                ref={backRef}
                className="folder-back-plate"
                style={{ clipPath: `url(#clip-back-${id})` }}
            >
                <svg className="folder-border-svg" aria-hidden="true">
                    <path d={backD} fill="none" className="folder-back-edge" strokeWidth="1.5" />
                </svg>
            </div>

            {/* Fanned Out Floating Technology Icons */}
            <div className="folder-fanned-icons-layer" aria-hidden="true">
                {icons.map((icon, i) => {
                    const k = i - (n - 1) / 2;
                    const gap = wide ? spread * 1.15 : spread;
                    const y = k * k * 8 - (wide ? 6 : 0);
                    const rot = k * rs * (wide ? 1.2 : 1);
                    const isIconHovered = hoveredIconIndex === i;
                    const isAnyHovered = hoveredIconIndex !== null;

                    return (
                        <div
                            key={icon.label}
                            className="folder-icon-anchor"
                            style={{
                                transform: `translate3d(${k * gap}px, ${y}px, 0) rotate(${rot}deg)`,
                                zIndex: isIconHovered ? 25 : 10 + i
                            }}
                        >
                            <div
                                className={`folder-icon-tile ${isIconHovered ? "tile-hovered" : ""} ${isAnyHovered && !isIconHovered ? "tile-dimmed" : ""
                                    }`}
                                onPointerEnter={(e) => {
                                    if (e.pointerType === "mouse") setHoveredIconIndex(i);
                                }}
                                onPointerLeave={() => {
                                    setHoveredIconIndex((curr) => (curr === i ? null : curr));
                                }}
                                style={{
                                    transform: isIconHovered
                                        ? `translateY(-28px) rotate(${-rot}deg) scale(1.15)`
                                        : isAnyHovered
                                            ? "scale(0.96)"
                                            : "none"
                                }}
                            >
                                <div
                                    className="folder-tile-surface"
                                    style={{ background: icon.background }}
                                >
                                    <img
                                        src={icon.src}
                                        alt={icon.label}
                                        className="folder-tile-logo"
                                        draggable="false"
                                        loading="lazy"
                                    />
                                </div>

                                {icon.label && (
                                    <span
                                        className={`folder-icon-tooltip ${isIconHovered ? "tooltip-visible" : ""
                                            }`}
                                    >
                                        {icon.label}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Glass Front Pocket with left-hand tab */}
            <div
                ref={frontRef}
                className="folder-front-pocket"
                style={{ clipPath: `url(#clip-front-${id})` }}
            >
                <svg className="folder-border-svg" aria-hidden="true">
                    <path
                        d={frontD}
                        fill="none"
                        stroke={`url(#edge-front-${id})`}
                        strokeWidth="1.5"
                    />
                </svg>

                <div className="folder-inner-content">
                    <div className="folder-header-row">
                        <span className="folder-tagline">
                            PROJECT / {project.number} &bull; {project.category}
                        </span>
                        {project.featured && (
                            <span className="folder-featured-pill">FEATURED</span>
                        )}
                    </div>

                    <h3 className="folder-title">{project.title}</h3>
                    <p className="folder-description">{project.description}</p>

                    {/* Technology tags */}
                    <div className="folder-tags-row">
                        {project.tech.map((tag) => {
                            const isMatched = activeHoveredLabel && activeHoveredLabel.toLowerCase() === tag.toLowerCase();
                            return (
                                <span
                                    key={tag}
                                    className={`folder-tag-chip ${isMatched ? "chip-matched" : ""}`}
                                >
                                    {tag}
                                </span>
                            );
                        })}
                    </div>

                    {/* Bottom Row: Actions + Tech Pill Dock */}
                    <div className="folder-bottom-bar">
                        {project.github ? (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noreferrer"
                                className="folder-github-btn"
                                aria-label={`View ${project.title} on GitHub`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Code2 size={15} />
                                <span>GITHUB</span>
                                <ArrowUpRight size={14} />
                            </a>
                        ) : (
                            <span className="folder-bottom-caption">Web Application</span>
                        )}

                        {/* Technology Icon Dock */}
                        <div className="folder-dock-pill" aria-label="Tech stack icons">
                            {icons.map((icon) => (
                                <span
                                    key={icon.label}
                                    className="folder-dock-item"
                                    title={icon.label}
                                    style={{ background: icon.background }}
                                >
                                    <img src={icon.src} alt="" draggable="false" />
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Projects() {
    const sectionRef = useRef(null);
    const wheelLockRef = useRef(false);
    const dragRef = useRef({ active: false, startX: 0 });

    const [activeIndex, setActiveIndex] = useState(0);

    const goToProject = useCallback((direction) => {
        setActiveIndex((current) => (current + direction + projects.length) % projects.length);
    }, []);

    const handleWheel = (event) => {
        if (Math.abs(event.deltaY) < 25 && Math.abs(event.deltaX) < 25) return;
        if (wheelLockRef.current) return;

        wheelLockRef.current = true;
        const direction = event.deltaY > 0 || event.deltaX > 0 ? 1 : -1;
        goToProject(direction);

        window.setTimeout(() => {
            wheelLockRef.current = false;
        }, 650);
    };

    const handlePointerDown = (event) => {
        if (event.target.closest("button, a")) return;
        dragRef.current.active = true;
        dragRef.current.startX = event.clientX;
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerUp = (event) => {
        if (!dragRef.current.active) return;
        const distance = event.clientX - dragRef.current.startX;
        if (Math.abs(distance) > 45) {
            goToProject(distance < 0 ? 1 : -1);
        }
        dragRef.current.active = false;
    };

    const handlePointerCancel = () => {
        dragRef.current.active = false;
    };

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) return;

        const ctx = gsap.context(() => {
            const heading = section.querySelector(".projects-heading");
            const intro = section.querySelector(".projects-intro");
            const stage = section.querySelector(".projects-carousel-stage");
            const bottom = section.querySelector(".projects-bottom");

            if (heading) {
                gsap.fromTo(
                    heading,
                    { y: 55, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.9,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: heading,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }

            if (intro) {
                gsap.fromTo(
                    intro,
                    { y: 35, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: intro,
                            start: "top 90%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }

            if (stage) {
                gsap.fromTo(
                    stage,
                    { y: 45, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.9,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: stage,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }

            if (bottom) {
                gsap.fromTo(
                    bottom,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 0.8,
                        scrollTrigger: {
                            trigger: bottom,
                            start: "top 95%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section className="projects-section" id="projects" ref={sectionRef}>
            <div className="projects-container">
                <div className="projects-topline">
                    <span>04 / SELECTED WORK</span>
                    <span>PROJECTS &amp; EXPERIMENTS</span>
                </div>

                <div className="projects-heading">
                    <p className="projects-eyebrow">THINGS I'VE BUILT</p>
                    <h2>
                        SELECTED
                        <br />
                        <span>PROJECTS.</span>
                    </h2>
                </div>

                {/* 3D Circular Project Folder Carousel */}
                <div
                    className="projects-carousel-stage"
                    onWheel={handleWheel}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                    onLostPointerCapture={handlePointerCancel}
                >
                    <div className="projects-carousel-track">
                        {projects.map((project, index) => {
                            const count = projects.length;
                            let offset = (index - activeIndex) % count;
                            if (offset > count / 2) offset -= count;
                            if (offset < -count / 2) offset += count;

                            const isCurrent = offset === 0;

                            return (
                                <div
                                    key={project.number}
                                    className={`projects-carousel-slide ${isCurrent ? "is-current" : ""}`}
                                    style={{
                                        "--folder-position": offset,
                                        "--folder-distance": Math.abs(offset)
                                    }}
                                    aria-hidden={!isCurrent}
                                >
                                    <ProjectFolderCard
                                        project={project}
                                        active={isCurrent}
                                        onSelect={() => goToProject(offset)}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Carousel Navigation Controls */}
                    <div className="projects-carousel-controls">
                        <button
                            type="button"
                            className="projects-nav-btn"
                            onClick={() => goToProject(-1)}
                            aria-label="Previous project"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div className="projects-counter-badge">
                            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
                            <span className="projects-counter-divider">/</span>
                            <span>{String(projects.length).padStart(2, "0")}</span>
                        </div>

                        <button
                            type="button"
                            className="projects-nav-btn"
                            onClick={() => goToProject(1)}
                            aria-label="Next project"
                        >
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    <p className="projects-drag-hint">
                        SCROLL OR DRAG TO NAVIGATE
                    </p>
                </div>

                <div className="projects-bottom">
                    <span>DESIGNED TO SOLVE. BUILT TO LEARN.</span>
                    <span>MORE PROJECTS COMING SOON</span>
                </div>
            </div>
        </section>
    );
}
