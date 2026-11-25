import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    ArrowUpRight,
    BriefcaseBusiness,
    MapPin,
    Calendar
} from "lucide-react";

import "./Experience.css";

gsap.registerPlugin(ScrollTrigger);

const experienceData = {
    number: "01",
    role: "Software Developer Intern",
    specialization: "Backend Development",
    company: "Future Invo Solutions Private Limited",
    duration: "22 December 2025 – 22 April 2026",
    location: "Hyderabad, India",
    type: "INTERNSHIP",

    responsibilities: [
        "Developed REST APIs using Spring Boot for course, session, attendance and exam management.",
        "Implemented role-based authentication and authorization using Spring Security for Admin, Instructor and Student roles.",
        "Implemented an exam workflow covering question mapping, response submission and automated evaluation.",
        "Integrated the React.js frontend with Spring Boot REST APIs using Axios.",
        "Designed MySQL database schemas and used joins and indexing for efficient data retrieval."
    ],

    technologies: [
        "Java",
        "Spring Boot",
        "Spring Security",
        "React.js",
        "Axios",
        "MySQL",
        "REST APIs",
        "Github"
    ]
};

export default function Experience() {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion) return;

        const ctx = gsap.context(() => {
            const heading = section.querySelector(".experience-heading");
            const intro = section.querySelector(".experience-intro");
            const showcase = section.querySelector(".experience-showcase-card");
            const respRows = section.querySelectorAll(".exp-resp-row");
            const techTags = section.querySelectorAll(".exp-tech-chip");
            const bottom = section.querySelector(".experience-bottom");

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

            if (showcase) {
                gsap.fromTo(
                    showcase,
                    { y: 45, opacity: 0 },
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

            if (respRows.length > 0) {
                gsap.fromTo(
                    respRows,
                    { y: 20, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.08,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: showcase,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }

            if (techTags.length > 0) {
                gsap.fromTo(
                    techTags,
                    { opacity: 0, scale: 0.92 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        stagger: 0.04,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: showcase,
                            start: "top 75%",
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
        <section
            className="experience-section"
            id="experience"
            ref={sectionRef}
        >
            <div className="experience-container">

                {/* Section Header */}
                <div className="experience-topline">
                    <span>EXPERIENCE</span>
                    <span>MY PROFESSIONAL JOURNEY</span>
                </div>

                {/* Main Heading & Intro */}
                <div className="experience-header-grid">
                    <div className="experience-heading">
                        <p className="experience-eyebrow">
                            CAREER &amp; EXPERIENCE
                        </p>

                        <h2>
                            WHERE I'VE
                            <br />
                            <span>WORKED.</span>
                        </h2>
                    </div>

                    <div className="experience-intro">
                        <p>
                            Professional journey and hands-on engineering
                            contributions delivering robust backend
                            architectures, authentication flows and
                            end-to-end full-stack integrations.
                        </p>
                    </div>
                </div>

                {/* Experience Card */}
                <article className="experience-showcase-card">

                    {/* Left Column */}
                    <div className="exp-left-col">

                        <div className="exp-meta-top">
                            <span className="exp-num">
                                {experienceData.number}
                            </span>

                            <span className="exp-type-badge">
                                <BriefcaseBusiness size={12} />
                                {experienceData.type}
                            </span>
                        </div>

                        <div className="exp-company-block">
                            <span className="exp-sublabel">
                                ORGANIZATION
                            </span>

                            <h3 className="exp-company-name">
                                {experienceData.company}
                            </h3>
                        </div>

                        <div className="exp-duration-block">
                            <span className="exp-sublabel">
                                TIMELINE
                            </span>

                            <div className="exp-duration-value">
                                <Calendar size={13} />
                                <span>{experienceData.duration}</span>
                            </div>
                        </div>

                        <div className="exp-tenure-tag">
                            <span>4-MONTH ON-SITE INTERNSHIP</span>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="exp-right-col">

                        {/* Role Header */}
                        <div className="exp-role-header">
                            <div>
                                <h4 className="exp-role-title">
                                    {experienceData.role}
                                </h4>

                                <div className="exp-spec-row">
                                    <span className="exp-specialization-badge">
                                        {experienceData.specialization}
                                    </span>

                                    <span className="exp-location-tag">
                                        <MapPin size={13} />
                                        {experienceData.location}
                                    </span>
                                </div>
                            </div>

                            <div
                                className="exp-arrow-mark"
                                aria-hidden="true"
                            >
                                <ArrowUpRight size={22} />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="exp-inner-divider" />

                        {/* Responsibilities */}
                        <div className="exp-contributions-section">
                            <span className="exp-sublabel">
                                KEY RESPONSIBILITIES &amp; CONTRIBUTIONS
                            </span>

                            <div className="exp-resp-table">
                                {experienceData.responsibilities.map(
                                    (resp, index) => (
                                        <div
                                            className="exp-resp-row"
                                            key={index}
                                        >
                                            <span
                                                className="exp-resp-dot"
                                                aria-hidden="true"
                                            />

                                            <p className="exp-resp-text">
                                                {resp}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Core Technologies */}
                        <div className="exp-tech-section">
                            <span className="exp-sublabel">
                                CORE TECHNOLOGIES USED
                            </span>

                            <div className="exp-tech-cloud">
                                {experienceData.technologies.map((tech) => (
                                    <span
                                        className="exp-tech-chip"
                                        key={tech}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </article>

                {/* Bottom Note */}
                <div className="experience-bottom">
                    <span>ALWAYS LEARNING. ALWAYS BUILDING.</span>

                    <span>
                        MORE TO COME
                        <ArrowUpRight size={14} />
                    </span>
                </div>

            </div>
        </section>
    );
}