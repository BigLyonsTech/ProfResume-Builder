import { useState, useRef, useCallback } from "react";

const API = "http://localhost:8080/api";

// ═══════════════════════════════════════════════════════════════
//  GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body { font-family: 'Outfit', sans-serif; background: #FAFAF9; color: #1C1917; -webkit-font-smoothing: antialiased; }
    input, textarea, select, button { font-family: 'Outfit', sans-serif; }
    ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #D6D3D1; border-radius: 99px; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes slideInRight { from { opacity:0; transform:translateX(28px); } to { opacity:1; transform:translateX(0); } }
    @keyframes toastIn { from { opacity:0; transform:translateX(calc(100% + 28px)); } to { opacity:1; transform:translateX(0); } }
    @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.4;} }
    @keyframes spin { to{transform:rotate(360deg);} }
    @keyframes shimmer { from{background-position:200% 0;} to{background-position:-200% 0;} }
    .fade-up { animation: fadeUp .4s cubic-bezier(.16,1,.3,1) forwards; }
    .slide-right { animation: slideInRight .35s cubic-bezier(.16,1,.3,1) forwards; }
    .toast-in { animation: toastIn .4s cubic-bezier(.16,1,.3,1) forwards; }
    .spin { animation: spin .7s linear infinite; }
    .pulse { animation: pulse 2s ease-in-out infinite; }
  `}</style>
);

// ═══════════════════════════════════════════════════════════════
//  DESIGN PRIMITIVES
// ═══════════════════════════════════════════════════════════════
const C = {
  gold: "#D97706", goldDark: "#B45309", goldLight: "rgba(217,119,6,.1)",
  bg: "#FAFAF9", surface: "#FFFFFF", border: "#E7E5E4",
  text: "#1C1917", muted: "#78716C", faint: "#A8A29E",
  sidebar: "#111827", sidebarHover: "rgba(255,255,255,.04)",
  accent: "#F59E0B",
  danger: "#EF4444", dangerBg: "#FEF2F2", dangerBorder: "#FECACA",
  success: "#10B981", successBg: "#ECFDF5", successBorder: "#A7F3D0",
  warn: "#D97706", warnBg: "#FFFBEB", warnBorder: "#FDE68A",
  blue: "#1E40AF", blueBg: "#EFF6FF", blueBorder: "#BFDBFE",
};

const focus = (err) => ({
  onFocus: e => { e.target.style.borderColor = err ? C.danger : C.gold; e.target.style.boxShadow = err ? "0 0 0 3px rgba(239,68,68,.1)" : `0 0 0 3px ${C.goldLight}`; },
  onBlur: e => { e.target.style.borderColor = err ? C.danger : C.border; e.target.style.boxShadow = "none"; },
});

const inputStyle = (err) => ({
  width: "100%", padding: "10px 14px",
  border: `1.5px solid ${err ? C.danger : C.border}`,
  borderRadius: 8, fontSize: 14, color: C.text, background: C.surface,
  outline: "none", transition: "all .2s",
  boxShadow: err ? `0 0 0 3px rgba(239,68,68,.08)` : "none",
});

const Label = ({ children, req }) => (
  <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", color:C.muted, marginBottom:6 }}>
    {children}{req && <span style={{ color:C.gold, marginLeft:3 }}>*</span>}
  </label>
);

const Input = ({ err, style: s, ...p }) => (
  <input style={{ ...inputStyle(err), ...s }} {...focus(err)} {...p} />
);

const Textarea = ({ err, style: s, ...p }) => (
  <textarea style={{ ...inputStyle(err), resize:"vertical", minHeight:100, lineHeight:1.6, ...s }} {...focus(err)} {...p} />
);

const Select = ({ err, children, ...p }) => (
  <select style={{
    ...inputStyle(err),
    cursor:"pointer", appearance:"none", paddingRight:36,
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2378716C' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center",
  }} {...focus(err)} {...p}>{children}</select>
);

const ErrMsg = ({ msg }) => msg
  ? <p style={{ fontSize:11.5, color:C.danger, marginTop:5, display:"flex", alignItems:"center", gap:4 }}>⚠ {msg}</p>
  : null;

const Field = ({ label, req, err, hint, children }) => (
  <div style={{ marginBottom:18 }}>
    {label && <Label req={req}>{label}</Label>}
    {children}
    {hint && !err && <p style={{ fontSize:11, color:C.faint, marginTop:4 }}>{hint}</p>}
    <ErrMsg msg={err} />
  </div>
);

const Row = ({ children, cols=2, gap=16 }) => (
  <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap }}>{children}</div>
);

const Divider = ({ mt=20, mb=20 }) => (
  <div style={{ borderTop:`1px solid ${C.border}`, margin:`${mt}px 0 ${mb}px` }} />
);

function Btn({ v="primary", children, style: s, ...p }) {
  const base = { border:"none", borderRadius:8, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8, transition:"all .2s", fontWeight:600, fontSize:13 };
  const variants = {
    primary:   { ...base, padding:"11px 26px", background:C.gold, color:"#fff" },
    secondary: { ...base, padding:"11px 26px", background:"transparent", color:C.muted, border:`1.5px solid ${C.border}`, fontWeight:500 },
    outline:   { ...base, padding:"9px 18px", background:"transparent", color:C.gold, border:`1.5px solid ${C.gold}`, fontWeight:500 },
    danger:    { ...base, padding:"7px 12px", background:"transparent", color:C.danger, border:`1.5px solid ${C.dangerBorder}`, fontWeight:500, fontSize:12 },
    ghost:     { ...base, padding:"8px 14px", background:"transparent", color:C.muted, border:"none", fontWeight:400, borderRadius:6 },
  };
  const hovers = {
    primary:   e => { e.currentTarget.style.background = C.goldDark; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(217,119,6,.35)"; },
    secondary: e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; },
    outline:   e => { e.currentTarget.style.background = C.goldLight; },
    danger:    e => { e.currentTarget.style.background = C.dangerBg; e.currentTarget.style.borderColor = C.danger; },
    ghost:     e => { e.currentTarget.style.background = "#F5F5F4"; e.currentTarget.style.color = C.text; },
  };
  const leaves = {
    primary:   e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; },
    secondary: e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; },
    outline:   e => { e.currentTarget.style.background = "transparent"; },
    danger:    e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = C.dangerBorder; },
    ghost:     e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; },
  };
  return (
    <button style={{ ...variants[v], ...s }} onMouseEnter={hovers[v]} onMouseLeave={leaves[v]} {...p}>
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════════════════════
const Toasts = ({ list }) => (
  <div style={{ position:"fixed", top:20, right:20, zIndex:9999, display:"flex", flexDirection:"column", gap:10, pointerEvents:"none" }}>
    {list.map(t => (
      <div key={t.id} className="toast-in" style={{
        padding:"12px 20px", borderRadius:10, fontSize:13, fontWeight:500,
        boxShadow:"0 8px 30px rgba(0,0,0,.12)", display:"flex", alignItems:"center", gap:10, minWidth:280, maxWidth:380,
        background: t.type==="success"?C.successBg : t.type==="error"?C.dangerBg : C.warnBg,
        border:`1px solid ${t.type==="success"?C.successBorder : t.type==="error"?C.dangerBorder : C.warnBorder}`,
        color: t.type==="success"?"#065F46" : t.type==="error"?"#991B1B" : "#92400E",
      }}>
        <span style={{ fontSize:16 }}>{t.type==="success"?"✓" : t.type==="error"?"✕" : "⚠"}</span>
        {t.msg}
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  CARD — reusable entry card
// ═══════════════════════════════════════════════════════════════
const EntryCard = ({ label, onRemove, children }) => (
  <div className="fade-up" style={{
    background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:12,
    padding:20, marginBottom:14,
    boxShadow:"0 1px 4px rgba(0,0,0,.04)",
    transition:"box-shadow .2s, border-color .2s",
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor="#D4B896"; e.currentTarget.style.boxShadow="0 3px 12px rgba(0,0,0,.07)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.04)"; }}
  >
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
      <span style={{ fontSize:11, fontWeight:700, color:C.gold, textTransform:"uppercase", letterSpacing:".09em" }}>{label}</span>
      <Btn v="danger" onClick={onRemove}>✕ Remove</Btn>
    </div>
    {children}
  </div>
);

const EmptyState = ({ icon, title, sub }) => (
  <div style={{
    textAlign:"center", padding:"36px 24px",
    border:`2px dashed ${C.border}`, borderRadius:14,
    color:C.faint, marginBottom:16,
    background:"rgba(250,250,249,.6)",
  }}>
    <div style={{ fontSize:36, marginBottom:10 }}>{icon}</div>
    <p style={{ fontSize:14, color:C.muted, fontWeight:500, marginBottom:4 }}>{title}</p>
    <p style={{ fontSize:12 }}>{sub}</p>
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  SIGNATURE PAD
// ═══════════════════════════════════════════════════════════════
const SignaturePad = ({ onSave }) => {
  const ref = useRef(null);
  const drawing = useRef(false);
  const [drawn, setDrawn] = useState(false);

  const init = useCallback(() => {
    const c = ref.current; if (!c) return;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const ctx = c.getContext("2d");
    ctx.strokeStyle = "#1C1917"; ctx.lineWidth = 2.2;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.fillStyle = "white"; ctx.fillRect(0, 0, c.width, c.height);
  }, []);

  const pos = (e) => {
    const c = ref.current; const r = c.getBoundingClientRect();
    const sx = c.width / r.width, sy = c.height / r.height;
    const src = e.touches?.[0] ?? e;
    return { x: (src.clientX - r.left) * sx, y: (src.clientY - r.top) * sy };
  };

  const onStart = (e) => { e.preventDefault(); init(); drawing.current = true; const {x,y} = pos(e); const ctx = ref.current.getContext("2d"); ctx.beginPath(); ctx.moveTo(x,y); };
  const onMove  = (e) => { e.preventDefault(); if (!drawing.current) return; const {x,y} = pos(e); const ctx = ref.current.getContext("2d"); ctx.lineTo(x,y); ctx.stroke(); setDrawn(true); };
  const onEnd   = () => { drawing.current = false; };
  const clear   = () => { init(); setDrawn(false); };
  const save    = () => { onSave(ref.current.toDataURL("image/png")); };

  return (
    <div>
      <canvas ref={ref} style={{
        width:"100%", height:150, display:"block", borderRadius:12, cursor:"crosshair",
        border:`2px dashed ${C.border}`, background:"white", touchAction:"none", transition:"border-color .2s",
      }}
        onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold}
        onMouseDown={onStart} onMouseMove={onMove}
        onMouseUp={onEnd}
        onMouseLeave={e=>{ onEnd(); e.currentTarget.style.borderColor=C.border; }}
        onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
      />
      <p style={{ textAlign:"center", fontSize:11.5, color:C.faint, margin:"8px 0 14px" }}>Draw your signature above using your mouse or touch</p>
      <div style={{ display:"flex", gap:10 }}>
        <Btn v="ghost" onClick={clear}>↺ Clear</Btn>
        <Btn v="outline" onClick={save} disabled={!drawn} style={{ opacity: drawn?1:.5 }}>✓ Use this signature</Btn>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  LIVE RESUME PREVIEW
// ═══════════════════════════════════════════════════════════════
const profDots = (level) => {
  const n = { BEGINNER:1, INTERMEDIATE:2, ADVANCED:3, EXPERT:4 }[level] || 0;
  return Array.from({length:4},(_,i)=>(
    <span key={i} style={{ width:6,height:6,borderRadius:"50%",background:i<n?C.blue:C.blueBorder,display:"inline-block",marginRight:2 }}/>
  ));
};

const Preview = ({ data }) => {
  const { personalInfo:pi, experiences, educations, skills, signature:sig } = data;
  const hasContent = pi.fullName || pi.email;
  const sec = (t) => (
    <div style={{ marginTop:14, marginBottom:8 }}>
      <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:8, fontWeight:700, letterSpacing:".13em", textTransform:"uppercase", color:C.blue, marginBottom:3 }}>{t}</p>
      <div style={{ height:1, background:`linear-gradient(90deg,${C.blueBorder},transparent)` }}/>
    </div>
  );

  if (!hasContent) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:480, gap:14, color:C.faint }}>
      <span style={{ fontSize:48 }}>📄</span>
      <div style={{ textAlign:"center" }}>
        <p style={{ fontSize:14, fontWeight:500, color:C.muted, marginBottom:6 }}>Your resume preview</p>
        <p style={{ fontSize:12, lineHeight:1.7, maxWidth:220 }}>Fill in the form on the left and watch your resume come to life here</p>
      </div>
    </div>
  );

  return (
    <div style={{ padding:"22px 24px", fontSize:10, lineHeight:1.55, color:C.text, fontFamily:"'Outfit',sans-serif" }}>
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:10 }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, color:C.blue, letterSpacing:".02em", lineHeight:1.2 }}>
          {pi.fullName||"Your Name"}
        </h1>
        <p style={{ fontSize:9, color:"#64748B", marginTop:5, lineHeight:1.8 }}>
          {[pi.phone,pi.email,pi.address].filter(Boolean).join("  ·  ")}
        </p>
        {(pi.linkedIn||pi.github||pi.portfolio) && (
          <p style={{ fontSize:9, color:C.blue, marginTop:2 }}>
            {[pi.linkedIn,pi.github,pi.portfolio].filter(Boolean).join("  ·  ")}
          </p>
        )}
      </div>
      <div style={{ borderBottom:`1.5px solid ${C.blue}`, marginBottom:6 }}/>

      {pi.summary && (<>{sec("Professional Summary")}
        <p style={{ fontSize:9.5, color:"#374151", lineHeight:1.65, textAlign:"justify" }}>{pi.summary}</p>
      </>)}

      {experiences.filter(e=>e.company||e.jobTitle).length>0 && (<>{sec("Work Experience")}
        {experiences.filter(e=>e.company||e.jobTitle).map((exp,i)=>(
          <div key={i} style={{ marginBottom:9 }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <strong style={{ fontSize:10 }}>{exp.jobTitle}</strong>
              <span style={{ fontSize:8.5, color:C.muted, whiteSpace:"nowrap" }}>
                {exp.startDate} – {exp.currentlyWorking?"Present":exp.endDate}
              </span>
            </div>
            <p style={{ fontSize:9, color:"#64748B", fontStyle:"italic", marginBottom:2 }}>{exp.company}</p>
            {exp.description&&<p style={{ fontSize:9, color:"#374151", lineHeight:1.55 }}>{exp.description}</p>}
          </div>
        ))}
      </>)}

      {educations.filter(e=>e.school).length>0 && (<>{sec("Education")}
        {educations.filter(e=>e.school).map((edu,i)=>(
          <div key={i} style={{ marginBottom:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <strong style={{ fontSize:10 }}>{edu.degree}{edu.fieldOfStudy?` in ${edu.fieldOfStudy}`:""}</strong>
              <span style={{ fontSize:8.5, color:C.muted }}>
                {edu.startYear} – {edu.currentlyStudying?"Present":edu.endYear}
              </span>
            </div>
            <p style={{ fontSize:9, color:"#64748B", fontStyle:"italic" }}>
              {edu.school}{edu.gpa?`  ·  GPA: ${edu.gpa}`:""}
            </p>
          </div>
        ))}
      </>)}

      {skills.filter(s=>s.name).length>0 && (<>{sec("Skills")}
        <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
          {skills.filter(s=>s.name).map((sk,i)=>(
            <div key={i} style={{ padding:"3px 9px", background:C.blueBg, border:`1px solid ${C.blueBorder}`, borderRadius:4, fontSize:9, color:C.blue, display:"flex", alignItems:"center", gap:5 }}>
              {sk.name}<span style={{ display:"flex" }}>{profDots(sk.proficiencyLevel)}</span>
            </div>
          ))}
        </div>
      </>)}

      {sig&&(sig.signatoryName||sig.imageData)&&(<>
        {sec("Signature")}
        {sig.signatureType==="TYPED"&&sig.signatoryName&&(
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:20, color:C.blue }}>{sig.signatoryName}</p>
        )}
        {sig.signatureType==="IMAGE"&&sig.imageData&&(
          <img src={sig.imageData} alt="sig" style={{ maxHeight:52, maxWidth:150 }}/>
        )}
        {sig.showDate&&sig.dateLabel&&<p style={{ fontSize:9, color:C.muted, marginTop:4 }}>{sig.dateLabel}</p>}
      </>)}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  STEP 1 — PERSONAL INFO
// ═══════════════════════════════════════════════════════════════
const Step1 = ({ data, set, errors }) => (
  <div className="fade-up">
    <Row>
      <Field label="Full Name" req err={errors.fullName}>
        <Input placeholder="e.g. Jane O'Brien-Smith" value={data.fullName} err={errors.fullName}
          onChange={e=>set("fullName", e.target.value.replace(/[^a-zA-Z\s''\-]/g,""))} />
      </Field>
      <Field label="Email Address" req err={errors.email}>
        <Input type="email" placeholder="jane@example.com" value={data.email} err={errors.email}
          onChange={e=>set("email", e.target.value)} />
      </Field>
    </Row>
    <Row>
      <Field label="Phone Number" req err={errors.phone} hint="Digits only, 7–15 characters">
        <Input placeholder="+61 412 345 678" value={data.phone} err={errors.phone}
          onChange={e=>set("phone", e.target.value.replace(/[^\d+]/g,""))} />
      </Field>
      <Field label="Address" req err={errors.address}>
        <Input placeholder="Sydney, NSW, Australia" value={data.address} err={errors.address}
          onChange={e=>set("address", e.target.value)} />
      </Field>
    </Row>
    <Field label="Professional Summary" req err={errors.summary}
      hint={`${data.summary.length}/500 characters — minimum 50`}>
      <Textarea placeholder="Write a compelling 2–4 sentence overview of your professional background, key skills, and career goals..."
        value={data.summary} err={errors.summary} style={{ minHeight:110 }}
        onChange={e=>set("summary", e.target.value)} />
    </Field>

    <Divider mt={24} mb={18}/>
    <p style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:".07em", textTransform:"uppercase", marginBottom:16 }}>
      Online Presence <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0, fontSize:11 }}>(optional)</span>
    </p>
    <Row cols={3}>
      <Field label="LinkedIn URL">
        <Input placeholder="linkedin.com/in/you" value={data.linkedIn} onChange={e=>set("linkedIn",e.target.value)}/>
      </Field>
      <Field label="GitHub URL">
        <Input placeholder="github.com/you" value={data.github} onChange={e=>set("github",e.target.value)}/>
      </Field>
      <Field label="Portfolio URL">
        <Input placeholder="https://yoursite.dev" value={data.portfolio} onChange={e=>set("portfolio",e.target.value)}/>
      </Field>
    </Row>
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  STEP 2 — EXPERIENCE
// ═══════════════════════════════════════════════════════════════
const blank_exp = { company:"", jobTitle:"", description:"", startDate:"", endDate:"", currentlyWorking:false };

const Step2 = ({ data, set }) => {
  const add    = () => set([...data, {...blank_exp}]);
  const remove = (i) => set(data.filter((_,j)=>j!==i));
  const upd    = (i,f,v) => { const a=[...data]; a[i]={...a[i],[f]:v}; set(a); };
  const today  = new Date().toISOString().split("T")[0];

  return (
    <div className="fade-up">
      {data.length===0 && <EmptyState icon="💼" title="No work experience added" sub="Add positions starting from your most recent role"/>}
      {data.map((exp,i)=>(
        <EntryCard key={i} label={`Position ${i+1}`} onRemove={()=>remove(i)}>
          <Row>
            <Field label="Job Title" req>
              <Input placeholder="Software Engineer" value={exp.jobTitle}
                onChange={e=>upd(i,"jobTitle",e.target.value.replace(/[^a-zA-Z\s&,'.()""\-]/g,""))}/>
            </Field>
            <Field label="Company Name" req>
              <Input placeholder="Google LLC" value={exp.company}
                onChange={e=>upd(i,"company",e.target.value)}/>
            </Field>
          </Row>
          <Row>
            <Field label="Start Date" req>
              <Input type="date" value={exp.startDate} max={today}
                onChange={e=>upd(i,"startDate",e.target.value)}/>
            </Field>
            <Field label="End Date">
              <Input type="date" value={exp.endDate}
                disabled={exp.currentlyWorking} style={{ opacity:exp.currentlyWorking?.5:1 }}
                min={exp.startDate} max={today}
                onChange={e=>upd(i,"endDate",e.target.value)}/>
            </Field>
          </Row>
          <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", marginBottom:16, userSelect:"none" }}>
            <input type="checkbox" checked={exp.currentlyWorking}
              style={{ width:16, height:16, accentColor:C.gold, cursor:"pointer" }}
              onChange={e=>{ upd(i,"currentlyWorking",e.target.checked); if(e.target.checked) upd(i,"endDate",""); }}/>
            <span style={{ fontSize:13, color:C.muted }}>I currently work here</span>
          </label>
          <Field label="Job Description" req hint={`${exp.description.length}/1000 — minimum 20 characters`}>
            <Textarea placeholder="Describe your responsibilities, achievements and impact in this role..."
              value={exp.description} style={{ minHeight:90 }}
              onChange={e=>upd(i,"description",e.target.value)}/>
          </Field>
        </EntryCard>
      ))}
      <Btn v="outline" onClick={add}>+ Add Work Experience</Btn>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  STEP 3 — EDUCATION
// ═══════════════════════════════════════════════════════════════
const blank_edu = { school:"", degree:"", fieldOfStudy:"", startYear:"", endYear:"", gpa:"", currentlyStudying:false };

const Step3 = ({ data, set }) => {
  const maxY = new Date().getFullYear();
  const add    = () => set([...data, {...blank_edu}]);
  const remove = (i) => set(data.filter((_,j)=>j!==i));
  const upd    = (i,f,v) => { const a=[...data]; a[i]={...a[i],[f]:v}; set(a); };

  return (
    <div className="fade-up">
      {data.length===0 && <EmptyState icon="🎓" title="No education added" sub="Add your degrees, diplomas and certifications"/>}
      {data.map((edu,i)=>(
        <EntryCard key={i} label={`Entry ${i+1}`} onRemove={()=>remove(i)}>
          <Field label="School / University" req>
            <Input placeholder="University of Queensland" value={edu.school}
              onChange={e=>upd(i,"school",e.target.value)}/>
          </Field>
          <Row>
            <Field label="Degree" req>
              <Input placeholder="Bachelor of Science" value={edu.degree}
                onChange={e=>upd(i,"degree",e.target.value.replace(/[^a-zA-Z\s.]/g,""))}/>
            </Field>
            <Field label="Field of Study" req>
              <Input placeholder="Software Engineering" value={edu.fieldOfStudy}
                onChange={e=>upd(i,"fieldOfStudy",e.target.value.replace(/[^a-zA-Z\s&,'.()""\-]/g,""))}/>
            </Field>
          </Row>
          <Row cols={3}>
            <Field label="Start Year" req>
              <Input type="number" placeholder="2020" min={1950} max={maxY} value={edu.startYear}
                onChange={e=>upd(i,"startYear",e.target.value)}/>
            </Field>
            <Field label="End Year">
              <Input type="number" placeholder={edu.currentlyStudying?"Present":"2024"}
                min={edu.startYear||1950} max={2100} value={edu.endYear}
                disabled={edu.currentlyStudying} style={{ opacity:edu.currentlyStudying?.5:1 }}
                onChange={e=>upd(i,"endYear",e.target.value)}/>
            </Field>
            <Field label="GPA (optional)">
              <Input type="number" placeholder="3.85" min={0} max={4} step={.01} value={edu.gpa}
                onChange={e=>upd(i,"gpa",e.target.value)}/>
            </Field>
          </Row>
          <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", userSelect:"none" }}>
            <input type="checkbox" checked={edu.currentlyStudying}
              style={{ width:16, height:16, accentColor:C.gold, cursor:"pointer" }}
              onChange={e=>{ upd(i,"currentlyStudying",e.target.checked); if(e.target.checked) upd(i,"endYear",""); }}/>
            <span style={{ fontSize:13, color:C.muted }}>Currently studying here</span>
          </label>
        </EntryCard>
      ))}
      <Btn v="outline" onClick={add}>+ Add Education</Btn>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  STEP 4 — SKILLS
// ═══════════════════════════════════════════════════════════════
const LEVELS = ["BEGINNER","INTERMEDIATE","ADVANCED","EXPERT"];
const LEVEL_COLOR = { BEGINNER:"#94A3B8", INTERMEDIATE:C.gold, ADVANCED:"#2563EB", EXPERT:"#059669" };
const LEVEL_W     = { BEGINNER:"25%", INTERMEDIATE:"50%", ADVANCED:"75%", EXPERT:"100%" };

const Step4 = ({ data, set }) => {
  const add    = () => set([...data, { name:"", proficiencyLevel:"INTERMEDIATE" }]);
  const remove = (i) => set(data.filter((_,j)=>j!==i));
  const upd    = (i,f,v) => { const a=[...data]; a[i]={...a[i],[f]:v}; set(a); };

  return (
    <div className="fade-up">
      {data.length===0 && <EmptyState icon="🛠️" title="No skills added" sub="Add technical skills, languages, tools and soft skills"/>}
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
        {data.map((sk,i)=>(
          <div key={i} className="fade-up" style={{
            background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:10,
            padding:"14px 16px", transition:"border-color .2s",
          }}
            onMouseEnter={e=>e.currentTarget.style.borderColor="#D4B896"}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
          >
            <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:10 }}>
              <Input style={{ flex:1 }} placeholder="e.g. Java, React, Python, C++" value={sk.name}
                onChange={e=>upd(i,"name",e.target.value.replace(/[^a-zA-Z0-9\s#+.()/\-]/g,""))}/>
              <Select style={{ width:170 }} value={sk.proficiencyLevel}
                onChange={e=>upd(i,"proficiencyLevel",e.target.value)}>
                {LEVELS.map(l=><option key={l} value={l}>{l.charAt(0)+l.slice(1).toLowerCase()}</option>)}
              </Select>
              <Btn v="danger" onClick={()=>remove(i)}>✕</Btn>
            </div>
            {/* Animated proficiency bar */}
            <div style={{ height:4, background:"#F5F5F4", borderRadius:2, overflow:"hidden", marginBottom:5 }}>
              <div style={{
                height:"100%", borderRadius:2,
                width:LEVEL_W[sk.proficiencyLevel],
                background:`linear-gradient(90deg,${LEVEL_COLOR[sk.proficiencyLevel]},${LEVEL_COLOR[sk.proficiencyLevel]}99)`,
                transition:"width .45s cubic-bezier(.4,0,.2,1)",
              }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              {LEVELS.map(l=>(
                <span key={l} style={{
                  fontSize:9, textTransform:"capitalize", fontWeight:l===sk.proficiencyLevel?700:400,
                  color:l===sk.proficiencyLevel?LEVEL_COLOR[l]:C.border,
                  transition:"color .2s",
                }}>
                  {l.charAt(0)+l.slice(1).toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Btn v="outline" onClick={add}>+ Add Skill</Btn>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  STEP 5 — SIGNATURE
// ═══════════════════════════════════════════════════════════════
const Step5 = ({ data, set }) => {
  const [tab, setTab] = useState(data.signatureType||"TYPED");
  const [saved, setSaved] = useState(data.imageData||null);
  const today = new Date().toLocaleDateString("en-AU",{ day:"2-digit", month:"long", year:"numeric" });

  const switchTab = (t) => {
    setTab(t); set("signatureType",t);
    if(t==="TYPED"){ set("imageData",""); setSaved(null); }
  };
  const handleDraw = (url) => { setSaved(url); set("imageData",url); set("signatureType","IMAGE"); };

  return (
    <div className="fade-up">
      <p style={{ fontSize:13, color:C.muted, marginBottom:24, lineHeight:1.7 }}>
        Add your signature to the bottom of your exported PDF. Choose between a typed style or hand-drawn.
      </p>

      {/* Tab switcher */}
      <div style={{ display:"inline-flex", background:"#F5F5F4", borderRadius:10, padding:4, gap:4, marginBottom:28 }}>
        {[["TYPED","✏️  Typed"],["IMAGE","🖊️  Hand-drawn"]].map(([t,label])=>(
          <button key={t} onClick={()=>switchTab(t)} style={{
            padding:"8px 22px", border:"none", borderRadius:7, fontSize:13, fontWeight:500,
            cursor:"pointer", transition:"all .2s",
            background: tab===t?"white":"transparent",
            color: tab===t?C.text:C.muted,
            boxShadow: tab===t?"0 1px 5px rgba(0,0,0,.1)":"none",
          }}>
            {label}
          </button>
        ))}
      </div>

      {tab==="TYPED" && (
        <div>
          <Field label="Your Name" req hint="Letters, spaces, hyphens and apostrophes only">
            <Input placeholder="e.g. Jane Smith" value={data.signatoryName} style={{ fontSize:15 }}
              onChange={e=>set("signatoryName",e.target.value.replace(/[^a-zA-Z\s''\-]/g,""))}/>
          </Field>
          {data.signatoryName && (
            <div style={{ marginTop:16, padding:"22px 28px", background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:12 }}>
              <p style={{ fontSize:10, color:C.faint, textTransform:"uppercase", letterSpacing:".07em", marginBottom:10 }}>Signature preview</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:30, color:C.blue, lineHeight:1.2 }}>
                {data.signatoryName}
              </p>
            </div>
          )}
        </div>
      )}

      {tab==="IMAGE" && (
        saved ? (
          <div>
            <div style={{ padding:"18px 22px", background:C.successBg, border:`1.5px solid ${C.successBorder}`, borderRadius:12, marginBottom:14 }}>
              <p style={{ fontSize:11, color:"#065F46", fontWeight:600, marginBottom:10 }}>✓ Signature captured</p>
              <img src={saved} alt="sig" style={{ maxHeight:65, maxWidth:220 }}/>
            </div>
            <Btn v="ghost" onClick={()=>{ setSaved(null); set("imageData",""); }}>↺ Draw again</Btn>
          </div>
        ) : (
          <SignaturePad onSave={handleDraw}/>
        )
      )}

      <Divider mt={28} mb={20}/>
      <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
        <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", userSelect:"none" }}>
          <input type="checkbox" checked={data.showDate}
            style={{ width:16, height:16, accentColor:C.gold, cursor:"pointer" }}
            onChange={e=>{ set("showDate",e.target.checked); if(e.target.checked&&!data.dateLabel) set("dateLabel",today); }}/>
          <span style={{ fontSize:13, color:C.muted }}>Show date on signature</span>
        </label>
        {data.showDate && (
          <Input style={{ flex:1, minWidth:200 }} placeholder={today} value={data.dateLabel}
            onChange={e=>set("dateLabel",e.target.value)}/>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  STEP 6 — REVIEW & EXPORT
// ═══════════════════════════════════════════════════════════════
const Step6 = ({ data, onExport, loading, resumeId }) => {
  const sections = [
    { label:"Personal Info",    done:!!data.personalInfo.fullName,        icon:"👤" },
    { label:"Work Experience",  done:data.experiences.length>0,           icon:"💼" },
    { label:"Education",        done:data.educations.length>0,            icon:"🎓" },
    { label:"Skills",           done:data.skills.length>0,                icon:"🛠️" },
    { label:"Signature",        done:!!(data.signature.signatoryName||data.signature.imageData), icon:"✍️" },
  ];
  const allDone = sections.every(s=>s.done);

  return (
    <div className="fade-up">
      <p style={{ fontSize:13, color:C.muted, marginBottom:24, lineHeight:1.7 }}>
        Review your resume completeness. All required sections must be saved before exporting your PDF.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:30 }}>
        {sections.map(s=>(
          <div key={s.label} style={{
            display:"flex", alignItems:"center", gap:14, padding:"13px 18px",
            background:C.surface, border:`1.5px solid ${s.done?C.successBorder:C.warnBorder}`,
            borderRadius:10, transition:"all .2s",
          }}>
            <span style={{ fontSize:20 }}>{s.icon}</span>
            <span style={{ flex:1, fontSize:14, fontWeight:500 }}>{s.label}</span>
            <span style={{
              fontSize:11, fontWeight:700, padding:"3px 12px", borderRadius:99,
              background:s.done?C.successBg:C.warnBg,
              color:s.done?"#065F46":"#92400E",
            }}>
              {s.done ? "✓ Complete" : "Incomplete"}
            </span>
          </div>
        ))}
      </div>

      {resumeId ? (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Btn v="primary" onClick={onExport} disabled={loading||!data.personalInfo.fullName}
            style={{ width:"100%", justifyContent:"center", padding:"14px 28px", fontSize:15, borderRadius:10 }}>
            {loading
              ? <><span className="spin" style={{ width:16,height:16,border:"2px solid white",borderTopColor:"transparent",borderRadius:"50%",display:"inline-block" }}/> Generating PDF...</>
              : "⬇  Download Resume PDF"
            }
          </Btn>
          {!allDone && (
            <p style={{ fontSize:12, color:"#92400E", background:C.warnBg, border:`1px solid ${C.warnBorder}`, borderRadius:8, padding:"10px 14px" }}>
              ⚠ Some sections are incomplete. Your PDF will still export, but completing all sections gives you the best result.
            </p>
          )}
        </div>
      ) : (
        <div style={{ background:C.warnBg, border:`1px solid ${C.warnBorder}`, borderRadius:10, padding:"14px 18px", fontSize:13, color:"#92400E" }}>
          ⚠ No resume saved yet. Go back and complete Step 1 to create your resume first.
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  SIDEBAR
// ═══════════════════════════════════════════════════════════════
const STEPS = [
  { id:1, label:"Personal Info",  icon:"👤", sub:"Contact details" },
  { id:2, label:"Experience",     icon:"💼", sub:"Work history" },
  { id:3, label:"Education",      icon:"🎓", sub:"Qualifications" },
  { id:4, label:"Skills",         icon:"🛠️",  sub:"Technical skills" },
  { id:5, label:"Signature",      icon:"✍️",  sub:"Sign your resume" },
  { id:6, label:"Export",         icon:"⬇",  sub:"Download PDF" },
];

const Sidebar = ({ current, done, onGo }) => (
  <aside style={{
    width:238, minHeight:"100vh", background:C.sidebar,
    display:"flex", flexDirection:"column", flexShrink:0,
    padding:"0 0 24px",
  }}>
    {/* Logo */}
    <div style={{ padding:"32px 24px 28px", borderBottom:"1px solid #1F2937" }}>
      <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:C.accent, lineHeight:1.25, letterSpacing:".02em" }}>
        Resume<br/>Builder
      </h1>
      <p style={{ fontSize:10.5, color:"#4B5563", marginTop:7, letterSpacing:".05em" }}>Professional Resume Creator</p>
    </div>

    {/* Steps */}
    <nav style={{ flex:1, padding:"18px 12px 0" }}>
      {STEPS.map(s=>{
        const active = current===s.id;
        const complete = done.includes(s.id);
        return (
          <button key={s.id} onClick={()=>onGo(s.id)} style={{
            width:"100%", padding:"10px 12px", background: active?"rgba(245,158,11,.1)":"transparent",
            border:"none", borderRadius:10, cursor:"pointer",
            display:"flex", alignItems:"center", gap:12, marginBottom:3,
            textAlign:"left", transition:"background .2s",
            borderLeft:`3px solid ${active?C.accent:"transparent"}`,
          }}
            onMouseEnter={e=>{ if(!active) e.currentTarget.style.background=C.sidebarHover; }}
            onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}
          >
            <div style={{
              width:32, height:32, borderRadius:"50%", flexShrink:0,
              background: complete?"#10B981" : active?C.accent : "#1F2937",
              border:`2px solid ${complete?"#10B981" : active?C.accent : "#374151"}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize: complete?12:15, transition:"all .3s",
            }}>
              {complete ? "✓" : s.icon}
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:active?600:400, color:active?C.accent:complete?"#D1FAE5":"#9CA3AF", marginBottom:1, transition:"color .2s" }}>
                {s.label}
              </p>
              <p style={{ fontSize:10, color:"#4B5563" }}>{s.sub}</p>
            </div>
          </button>
        );
      })}
    </nav>

    <div style={{ padding:"20px 20px 0", borderTop:"1px solid #1F2937", margin:"0 12px" }}>
      <p style={{ fontSize:10, color:"#374151", lineHeight:1.7 }}>
        Data is saved to your Spring Boot backend at{" "}
        <span style={{ color:C.accent }}>localhost:8080</span>
      </p>
    </div>
  </aside>
);

// ═══════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════
const INIT = {
  title: "My Resume",
  personalInfo: { fullName:"", email:"", phone:"", address:"", summary:"", linkedIn:"", github:"", portfolio:"" },
  experiences: [],
  educations: [],
  skills: [],
  signature: { signatureType:"TYPED", signatoryName:"", imageData:"", showDate:true, dateLabel:"" },
};

const STEP_TITLES = ["Personal Information","Work Experience","Education","Skills","Signature","Review & Export"];
const STEP_DESCS  = [
  "Your contact details and professional summary",
  "Your work history, starting from the most recent role",
  "Your academic qualifications and certifications",
  "Your technical and professional skills",
  "Add your signature to the exported PDF",
  "Review completeness and download your resume",
];

export default function App() {
  const [step,       setStep]       = useState(1);
  const [done,       setDone]       = useState([]);
  const [form,       setForm]       = useState(INIT);
  const [resumeId,   setResumeId]   = useState(null);
  const [toasts,     setToasts]     = useState([]);
  const [saving,     setSaving]     = useState(false);
  const [exporting,  setExporting]  = useState(false);
  const [preview,    setPreview]    = useState(true);
  const [errors,     setErrors]     = useState({});
  const tid = useRef(0);

  // ── Toast helper ────────────────────────────────────────────
  const toast = useCallback((msg, type="success") => {
    const id = ++tid.current;
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)), 4500);
  },[]);

  // ── Form updaters ────────────────────────────────────────────
  const setPI  = (f,v) => setForm(d=>({...d, personalInfo:{...d.personalInfo,[f]:v}}));
  const setSig = (f,v) => setForm(d=>({...d, signature:{...d.signature,[f]:v}}));

  // ── Validation ───────────────────────────────────────────────
  const validatePI = () => {
    const pi=form.personalInfo; const e={};
    if(!pi.fullName.trim())               e.fullName="Full name is required";
    else if(!/^[a-zA-Z\s''\-]+$/.test(pi.fullName)) e.fullName="Letters, spaces, hyphens and apostrophes only";
    if(!pi.email.trim())                  e.email="Email address is required";
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pi.email)) e.email="Must be a valid email address";
    if(!pi.phone.trim())                  e.phone="Phone number is required";
    else if(!/^[+]?[0-9]{7,15}$/.test(pi.phone)) e.phone="7–15 digits, optional leading +";
    if(!pi.address.trim())                e.address="Address is required";
    if(!pi.summary.trim())                e.summary="Professional summary is required";
    else if(pi.summary.trim().length<50)  e.summary=`Too short — need ${50-pi.summary.trim().length} more characters`;
    return e;
  };

  // ── API calls ────────────────────────────────────────────────
  const savePI = async () => {
    let rid=resumeId;
    if(!rid){
      const r=await fetch(`${API}/resumes`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:form.title||"My Resume"})});
      if(!r.ok) throw new Error("Failed to create resume — is Spring Boot running?");
      const res=await r.json(); rid=res.id; setResumeId(rid);
    }
    const r=await fetch(`${API}/resumes/${rid}/personal-info`,{
      method: resumeId?"PUT":"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(form.personalInfo),
    });
    if(!r.ok){
      const err=await r.json().catch(()=>({}));
      if(err.fieldErrors){ setErrors(err.fieldErrors); throw new Error("Validation failed. Fix the highlighted fields."); }
      throw new Error(err.message||"Failed to save personal info");
    }
    toast("Personal info saved ✓");
  };

  const saveExp = async () => {
    if(!resumeId) return; if(form.experiences.length===0){ toast("No experience to save"); return; }
    for(const e of form.experiences){
      if(!e.company||!e.jobTitle||!e.startDate||!e.description) continue;
      const r=await fetch(`${API}/resumes/${resumeId}/experiences`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...e, endDate:e.currentlyWorking?null:e.endDate||null, startDate:e.startDate}),
      });
      if(!r.ok){ const err=await r.json().catch(()=>({})); throw new Error(err.message||"Failed to save experience"); }
    }
    toast("Work experience saved ✓");
  };

  const saveEdu = async () => {
    if(!resumeId) return; if(form.educations.length===0){ toast("No education to save"); return; }
    for(const e of form.educations){
      if(!e.school||!e.degree||!e.startYear) continue;
      const r=await fetch(`${API}/resumes/${resumeId}/educations`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...e, startYear:parseInt(e.startYear), endYear:e.currentlyStudying?null:e.endYear?parseInt(e.endYear):null, gpa:e.gpa?parseFloat(e.gpa):null}),
      });
      if(!r.ok){ const err=await r.json().catch(()=>({})); throw new Error(err.message||"Failed to save education"); }
    }
    toast("Education saved ✓");
  };

  const saveSkills = async () => {
    if(!resumeId) return; if(form.skills.length===0){ toast("No skills to save"); return; }
    for(const s of form.skills){
      if(!s.name.trim()) continue;
      const r=await fetch(`${API}/resumes/${resumeId}/skills`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name:s.name,proficiencyLevel:s.proficiencyLevel}),
      });
      if(!r.ok){ const err=await r.json().catch(()=>({})); throw new Error(err.message||"Failed to save: "+s.name); }
    }
    toast("Skills saved ✓");
  };

  const saveSig = async () => {
    if(!resumeId) return;
    const s=form.signature; if(!s.signatoryName&&!s.imageData){ toast("Signature skipped"); return; }
    const r=await fetch(`${API}/resumes/${resumeId}/signature`,{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({signatureType:s.signatureType,signatoryName:s.signatoryName||null,imageData:s.imageData||null,showDate:s.showDate,dateLabel:s.dateLabel||null}),
    });
    if(!r.ok){ const err=await r.json().catch(()=>({})); throw new Error(err.message||"Failed to save signature"); }
    toast("Signature saved ✓");
  };

  const saveMap = [savePI, saveExp, saveEdu, saveSkills, saveSig];

  const handleNext = async () => {
    if(step===1){ const e=validatePI(); if(Object.keys(e).length){ setErrors(e); toast("Fix the errors before continuing","error"); return; } setErrors({}); }
    setSaving(true);
    try {
      if(step<=5) await saveMap[step-1]();
      setDone(d=>d.includes(step)?d:[...d,step]);
      setStep(s=>Math.min(s+1,6));
    } catch(err){ toast(err.message||"Something went wrong","error"); }
    finally{ setSaving(false); }
  };

  const handleExport = async () => {
    if(!resumeId) return;
    setExporting(true);
    try {
      const r=await fetch(`${API}/resumes/${resumeId}/pdf`);
      if(!r.ok) throw new Error("Failed to generate PDF");
      const blob=await r.blob();
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a"); a.href=url; a.download=`resume-${resumeId}.pdf`; a.click();
      URL.revokeObjectURL(url);
      toast("PDF downloaded successfully ✓");
    } catch(err){ toast(err.message,"error"); }
    finally{ setExporting(false); }
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <>
      <GlobalStyles/>
      <Toasts list={toasts}/>
      <div style={{ display:"flex", minHeight:"100vh" }}>
        <Sidebar current={step} done={done} onGo={setStep}/>

        {/* Main */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

          {/* Top bar */}
          <header style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"15px 32px", borderBottom:`1px solid ${C.border}`,
            background:C.surface, position:"sticky", top:0, zIndex:100,
            boxShadow:"0 1px 0 rgba(0,0,0,.04)",
          }}>
            <div>
              <h2 style={{ fontSize:17, fontWeight:600, color:C.text, marginBottom:2 }}>{STEP_TITLES[step-1]}</h2>
              <p style={{ fontSize:12, color:C.faint }}>{STEP_DESCS[step-1]}</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <input value={form.title}
                onChange={e=>setForm(d=>({...d,title:e.target.value}))}
                placeholder="Resume title..."
                style={{
                  padding:"7px 12px", border:`1.5px solid ${C.border}`, borderRadius:7,
                  fontSize:13, color:C.text, background:C.bg, outline:"none",
                  width:190, fontFamily:"'Outfit',sans-serif",
                }}/>
              <button onClick={()=>setPreview(p=>!p)} style={{
                padding:"7px 15px", border:`1.5px solid ${C.border}`, borderRadius:7,
                fontSize:12, fontWeight:500, cursor:"pointer", transition:"all .2s", fontFamily:"'Outfit',sans-serif",
                background:preview?"#1C1917":"white", color:preview?"white":C.muted,
              }}>
                {preview?"◧ Hide Preview":"◧ Show Preview"}
              </button>
            </div>
          </header>

          {/* Progress bar */}
          <div style={{ height:3, background:"#F0EFED" }}>
            <div style={{
              height:"100%", width:`${(step/6)*100}%`,
              background:`linear-gradient(90deg,${C.accent},${C.gold})`,
              transition:"width .5s cubic-bezier(.4,0,.2,1)",
            }}/>
          </div>

          {/* Content */}
          <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

            {/* Form */}
            <div style={{ flex:preview?"0 0 56%":1, overflow:"auto", padding:"32px 36px 60px", transition:"flex .3s" }}>
              {step===1 && <Step1 data={form.personalInfo} set={setPI} errors={errors}/>}
              {step===2 && <Step2 data={form.experiences} set={v=>setForm(d=>({...d,experiences:v}))}/>}
              {step===3 && <Step3 data={form.educations}  set={v=>setForm(d=>({...d,educations:v}))}/>}
              {step===4 && <Step4 data={form.skills}      set={v=>setForm(d=>({...d,skills:v}))}/>}
              {step===5 && <Step5 data={form.signature}   set={setSig}/>}
              {step===6 && <Step6 data={form} onExport={handleExport} loading={exporting} resumeId={resumeId}/>}

              {/* Navigation */}
              {step<6 && (
                <div style={{
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  marginTop:36, paddingTop:24, borderTop:`1px solid ${C.border}`,
                }}>
                  <Btn v="secondary" onClick={()=>setStep(s=>Math.max(s-1,1))} disabled={step===1} style={{ opacity:step===1?.4:1 }}>
                    ← Previous
                  </Btn>
                  <span style={{ fontSize:12, color:C.faint }}>Step {step} of 6</span>
                  <Btn v="primary" onClick={handleNext} disabled={saving}>
                    {saving
                      ? <><span className="spin" style={{ width:14,height:14,border:"2px solid white",borderTopColor:"transparent",borderRadius:"50%",display:"inline-block" }}/> Saving...</>
                      : step===5 ? "Save & Review →" : "Save & Continue →"
                    }
                  </Btn>
                </div>
              )}
            </div>

            {/* Preview */}
            {preview && (
              <div className="slide-right" style={{
                flex:"0 0 44%", borderLeft:`1px solid ${C.border}`,
                background:"#F4F4F2", overflow:"auto",
              }}>
                {/* Preview header */}
                <div style={{
                  padding:"11px 22px", borderBottom:`1px solid ${C.border}`,
                  background:C.surface, display:"flex", alignItems:"center", justifyContent:"space-between",
                  position:"sticky", top:0, zIndex:10,
                }}>
                  <span style={{ fontSize:10.5, fontWeight:700, color:C.faint, letterSpacing:".09em", textTransform:"uppercase" }}>
                    Live Preview
                  </span>
                  <span style={{ fontSize:10, color:"#D1D5DB", display:"flex", alignItems:"center", gap:5 }}>
                    <span className="pulse" style={{ width:6,height:6,borderRadius:"50%",background:C.success,display:"inline-block" }}/>
                    Real-time
                  </span>
                </div>
                {/* Preview body */}
                <div style={{ padding:"22px 20px" }}>
                  <div style={{
                    background:C.surface, borderRadius:8,
                    boxShadow:"0 4px 24px rgba(0,0,0,.07), 0 1px 4px rgba(0,0,0,.05)",
                    minHeight:550, overflow:"hidden",
                  }}>
                    <Preview data={form}/>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
