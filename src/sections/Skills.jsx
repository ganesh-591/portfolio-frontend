import React, { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Skills.css";

gsap.registerPlugin(ScrollTrigger);

const skills = [
    { name: "Java", icon: "java/java-original.svg" },
    { name: "Spring Boot", icon: "spring/spring-original.svg" },
    { name: "React", icon: "react/react-original.svg" },
    { name: "JavaScript", icon: "javascript/javascript-original.svg" },
    { name: "REST APIs", icon: "fastapi/fastapi-original.svg" },
    { name: "MySQL", icon: "mysql/mysql-original.svg" },
    { name: "Hibernate", icon: "hibernate/hibernate-original.svg" },
    { name: "Git", icon: "git/git-original.svg" },
    { name: "GitHub", icon: "github/github-original.svg" },
    { name: "Postman", icon: "postman/postman-original.svg" },
    { name: "Maven", icon: "apache/apache-original.svg" },
    { name: "HTML5 & CSS3", icon: "html5/html5-original.svg" }
];

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";

export default function Skills() {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);
    const dragRef = useRef({
        active: false,
        x: 0,
        y: 0,
        rotateX: -8,
        rotateY: 0
    });

    const [rotation, setRotation] = useState({
        x: -8,
        y: 0
    });

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion) return;

        const ctx = gsap.context(() => {
            const heading = section.querySelector(".skills-heading");
            const showcase = section.querySelector(".skills-showcase");
            const cards = section.querySelectorAll(".tech-icon-card");
            const footer = section.querySelector(".skills-showcase-footer");

            if (heading) {
                gsap.fromTo(
                    heading,
                    { y: 65, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: heading,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }

            if (showcase) {
                gsap.fromTo(
                    showcase,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.9,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: showcase,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }

            if (cards.length > 0) {
                gsap.fromTo(
                    cards,
                    { y: 35, opacity: 0, scale: 0.92 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.65,
                        stagger: 0.04,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: showcase || cards[0],
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }

            if (footer) {
                gsap.fromTo(
                    footer,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: footer,
                            start: "top 95%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        }, section);

        return () => ctx.revert();
    }, []);

    const handlePointerDown = (event) => {
        dragRef.current.active = true;
        dragRef.current.x = event.clientX;
        dragRef.current.y = event.clientY;

        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event) => {
        if (!dragRef.current.active) return;

        const deltaX = event.clientX - dragRef.current.x;
        const deltaY = event.clientY - dragRef.current.y;

        dragRef.current.rotateY += deltaX * 0.45;
        dragRef.current.rotateX -= deltaY * 0.35;

        dragRef.current.rotateX = Math.max(
            -30,
            Math.min(30, dragRef.current.rotateX)
        );

        dragRef.current.x = event.clientX;
        dragRef.current.y = event.clientY;

        setRotation({
            x: dragRef.current.rotateX,
            y: dragRef.current.rotateY
        });
    };

    const handlePointerUp = () => {
        dragRef.current.active = false;
    };

    const handlePointerCancel = () => {
        dragRef.current.active = false;
    };

    return (
        <section className="skills-section" id="skills" ref={sectionRef}>
            <div className="skills-container">

                <div className="skills-topline">
                    <span>MY EXPERTISE</span>
                    <span>TECHNICAL SKILLS</span>
                </div>

                <div className="skills-heading">
                    <p className="skills-eyebrow">TECH STACK &amp; TOOLS</p>
                    <h2>
                        TOOLS &amp;
                        <br />
                        <span>EXPERTISE.</span>
                    </h2>
                </div>

                <div className="skills-showcase">

                    <div className="skills-showcase-heading">
                        <p>12 TECHNOLOGIES <span>•</span> MODERN TECH ECOSYSTEM</p>
                    </div>

                    <div
                        className="skills-3d-stage"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerCancel}
                        onLostPointerCapture={handlePointerUp}
                    >
                        <div
                            className="skills-icon-grid"
                            ref={gridRef}
                            style={{
                                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                            }}
                        >
                            {skills.map((skill, index) => (
                                <div
                                    className="tech-icon-card"
                                    key={skill.name}
                                    style={{ "--tile-index": index }}
                                    title={skill.name}
                                >
                                    <img
                                        src={`${DEVICON}${skill.icon}`}
                                        alt={skill.name}
                                        className={skill.name === "GitHub" ? "github-skill-icon" : ""}
                                        draggable="false"
                                        loading="lazy"
                                    />

                                    <span className="tech-tooltip">
                                        {skill.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="skills-showcase-footer">
                        <span>JAVA FULL STACK DEVELOPMENT</span>
                        <span>12 / 12 SKILLS</span>
                    </div>

                </div>
            </div>
        </section>
    );
}
