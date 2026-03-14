"use client"
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react"

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  bold: "M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z",
  italic: "M19 4h-9M14 20H5M15 4L9 20",
  underline: "M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M4 21h16",
  strikethrough: "M17.3 4.9c-2.3-.6-4.4-1-6.2-.9-2.7 0-5.3.7-5.3 3.6 0 1.5 1.1 2.4 3.1 3.1C10.1 11 11 11 11 11m0 0C7 11 4 12.5 4 15.5 4 18 6.5 19 9 19c2.3 0 4.6-.5 6.3-1.4M4 12h16",
  h1: "M4 4v16M20 4v16M4 12h16",
  h2: "M4 4v16M12 4v16M4 12h8",
  ul: "M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01",
  ol: "M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M4 14l2-1v5M4 19h2",
  quote: "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z",
  link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  image: "M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2z",
  video: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z M9.75 15.02l5.75-3.02-5.75-3.02v6.04z",
  divider: "M3 12h18",
  columns: "M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z M19 3h-4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z",
  stats: "M18 20V10M12 20V4M6 20v-6",
  button: "M3 12h18M3 6h18M3 18h18",
  trash: "M3 6h18M19 6l-1 14H6L5 6M8 6V4h8v2",
  move: "M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20",
  up: "M18 15l-6-6-6 6",
  down: "M6 9l6 6 6-6",
  copy: "M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.5L14.5 2H10a2 2 0 0 0-2 2z M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  plus: "M12 5v14M5 12h14",
  save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8M7 3v5h8",
};

// ─── Block Types Config ───────────────────────────────────────────────────────
const BLOCK_TYPES = [
  { type: "text", label: "Rich Text", icon: ICONS.edit, desc: "Paragraph with formatting" },
  { type: "heading", label: "Heading", icon: ICONS.h1, desc: "Section heading" },
  { type: "image", label: "Image", icon: ICONS.image, desc: "Image with caption" },
  { type: "video", label: "Video Embed", icon: ICONS.video, desc: "YouTube or Vimeo URL" },
  { type: "quote", label: "Quote", icon: ICONS.quote, desc: "Pull quote or testimonial" },
  { type: "stats", label: "Stats Row", icon: ICONS.stats, desc: "3 or 4 key numbers" },
  { type: "columns", label: "Two Columns", icon: ICONS.columns, desc: "Side-by-side content" },
  { type: "cta", label: "CTA Button", icon: ICONS.button, desc: "Call-to-action button" },
  { type: "divider", label: "Divider", icon: ICONS.divider, desc: "Visual separator" },
  { type: "list", label: "List", icon: ICONS.ul, desc: "Bullet or numbered list" },
];

// ─── Default block data ───────────────────────────────────────────────────────
function makeBlock(type) {
  const id = Math.random().toString(36).slice(2);
  const defaults = {
    text: { html: "", placeholder: "start writing here..." },
    heading: { text: "", level: "h2", align: "left" },
    image: { url: "", caption: "", alt: "", width: "full" },
    video: { url: "", caption: "" },
    quote: { text: "An inspiring quote or key message about this event.", author: "", role: "" },
    stats: { items: [{ value: "1,200+", label: "Exhibitors" }, { value: "54", label: "Countries" }, { value: "31,000+", label: "Visitors" }, { value: "3", label: "Days" }] },
    columns: { left: "<p>Left column content</p>", right: "<p>Right column content</p>" },
    cta: { text: "Request a Quote", url: "#", style: "primary", align: "center" },
    divider: { style: "line" },
    list: { ordered: false, items: ["First key point", "Second key point", "Third key point"] },
  };
  return { id, type, ...defaults[type] };
}

// ─── RichTextToolbar ─────────────────────────────────────────────────────────
function RichTextToolbar({ targetRef }) {
  const exec = (cmd, val = null) => {
    targetRef.current?.focus();
    document.execCommand(cmd, false, val);
  };

  const tools = [
    { title: "Bold", icon: ICONS.bold, cmd: "bold" },
    { title: "Italic", icon: ICONS.italic, cmd: "italic" },
    { title: "Underline", icon: ICONS.underline, cmd: "underline" },
    { title: "Strike", icon: ICONS.strikethrough, cmd: "strikeThrough" },
    null,
    { title: "H2", icon: ICONS.h1, cmd: "formatBlock", val: "h2" },
    { title: "H3", icon: ICONS.h2, cmd: "formatBlock", val: "h3" },
    null,
    { title: "Bullet List", icon: ICONS.ul, cmd: "insertUnorderedList" },
    { title: "Number List", icon: ICONS.ol, cmd: "insertOrderedList" },
    null,
    {
      title: "Link", icon: ICONS.link, action: () => {
        const url = prompt("Enter URL:");
        if (url) exec("createLink", url);
      }
    },
  ];

  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 2, padding: "6px 8px",
      background: "#1a1a1a", borderBottom: "1px solid #2a2a2a", borderRadius: "6px 6px 0 0"
    }}>
      {tools.map((tool, i) =>
        tool === null
          ? <div key={i} style={{ width: 1, background: "#333", margin: "2px 4px", alignSelf: "stretch" }} />
          : (
            <button key={tool.title} title={tool.title}
              onMouseDown={(e) => { e.preventDefault(); tool.action ? tool.action() : exec(tool.cmd, tool.val); }}
              style={{
                padding: "4px 6px", background: "transparent", border: "none",
                color: "#ccc", cursor: "pointer", borderRadius: 4, display: "flex",
                alignItems: "center", transition: "all .15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#2a2a2a"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <Icon d={tool.icon} size={14} />
            </button>
          )
      )}
    </div>
  );
}

// ─── Block Editors ────────────────────────────────────────────────────────────
function TextEditor({ block, onChange }) {
  const ref = useRef();
  return (
    <div style={{ border: "1px solid #2a2a2a", borderRadius: 6, overflow: "hidden" }}>
      <RichTextToolbar targetRef={ref} />
      <div ref={ref} contentEditable suppressContentEditableWarning
        onBlur={e => onChange({ html: e.currentTarget.innerHTML })}
        dangerouslySetInnerHTML={{ __html: block.html, }}
        data-placeholder="Start writing your event content here..."
        style={{
          padding: "12px 14px", minHeight: 80, outline: "none",
          background: "#111", color: "#e5e5e5", fontSize: 14, lineHeight: 1.7
        }}
      />
    </div>
  );
}

function HeadingEditor({ block, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {["h2", "h3", "h4"].map(l => (
          <button key={l} onClick={() => onChange({ level: l })}
            style={{
              padding: "4px 10px", borderRadius: 4, border: "1px solid",
              borderColor: block.level === l ? "#cc2222" : "#333",
              background: block.level === l ? "#cc2222" : "transparent",
              color: block.level === l ? "#fff" : "#888", cursor: "pointer", fontSize: 12
            }}>
            {l.toUpperCase()}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {["left", "center", "right"].map(a => (
          <button key={a} onClick={() => onChange({ align: a })}
            style={{
              padding: "4px 10px", borderRadius: 4, border: "1px solid",
              borderColor: block.align === a ? "#cc2222" : "#333",
              background: block.align === a ? "#cc2222" : "transparent",
              color: block.align === a ? "#fff" : "#888", cursor: "pointer", fontSize: 12
            }}>
            {a[0].toUpperCase() + a.slice(1)}
          </button>
        ))}
      </div>
      <input value={block.text} onChange={e => onChange({ text: e.target.value })}
        placeholder="Heading text..."
        style={{
          padding: "10px 12px", background: "#111", border: "1px solid #2a2a2a",
          borderRadius: 6, color: "#fff", fontSize: 18, fontWeight: 700, outline: "none"
        }}
      />
    </div>
  );
}

function ImageEditor({ block, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <input value={block.url} onChange={e => onChange({ url: e.target.value })}
        placeholder="Image URL (https://...)"
        style={inputStyle} />
      {block.url && (
        <img src={block.url} alt="preview"
          style={{ maxHeight: 200, objectFit: "cover", borderRadius: 6, border: "1px solid #2a2a2a" }} />
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <input value={block.caption} onChange={e => onChange({ caption: e.target.value })}
          placeholder="Caption (optional)" style={{ ...inputStyle, flex: 1 }} />
        <select value={block.width} onChange={e => onChange({ width: e.target.value })}
          style={{ ...inputStyle, width: 120 }}>
          <option value="full">Full Width</option>
          <option value="wide">Wide</option>
          <option value="medium">Medium</option>
        </select>
      </div>
    </div>
  );
}

function VideoEditor({ block, onChange }) {
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
    return null;
  };
  const embedUrl = getEmbedUrl(block.url);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <input value={block.url} onChange={e => onChange({ url: e.target.value })}
        placeholder="YouTube or Vimeo URL..." style={inputStyle} />
      {embedUrl && (
        <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #2a2a2a" }}>
          <iframe src={embedUrl} width="100%" height="240" frameBorder="0"
            allowFullScreen title="video preview" />
        </div>
      )}
      <input value={block.caption} onChange={e => onChange({ caption: e.target.value })}
        placeholder="Caption (optional)" style={inputStyle} />
    </div>
  );
}

function QuoteEditor({ block, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <textarea value={block.text} onChange={e => onChange({ text: e.target.value })}
        placeholder="Quote text..." rows={3}
        style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, fontStyle: "italic" }} />
      <div style={{ display: "flex", gap: 8 }}>
        <input value={block.author} onChange={e => onChange({ author: e.target.value })}
          placeholder="Author name" style={{ ...inputStyle, flex: 1 }} />
        <input value={block.role} onChange={e => onChange({ role: e.target.value })}
          placeholder="Title / Role" style={{ ...inputStyle, flex: 1 }} />
      </div>
    </div>
  );
}

function StatsEditor({ block, onChange }) {
  const update = (i, field, val) => {
    const items = block.items.map((item, idx) => idx === i ? { ...item, [field]: val } : item);
    onChange({ items });
  };
  const add = () => onChange({ items: [...block.items, { value: "0", label: "Stat" }] });
  const remove = (i) => onChange({ items: block.items.filter((_, idx) => idx !== i) });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
        {block.items.map((item, i) => (
          <div key={i} style={{
            background: "#1a1a1a", border: "1px solid #2a2a2a",
            borderRadius: 8, padding: "10px 12px", position: "relative"
          }}>
            <button onClick={() => remove(i)} style={{
              position: "absolute", top: 6, right: 6,
              background: "none", border: "none", color: "#555", cursor: "pointer", padding: 2
            }}>
              <Icon d={ICONS.trash} size={12} />
            </button>
            <input value={item.value} onChange={e => update(i, "value", e.target.value)}
              placeholder="Value" style={{ ...inputStyle, fontWeight: 700, fontSize: 18, marginBottom: 4 }} />
            <input value={item.label} onChange={e => update(i, "label", e.target.value)}
              placeholder="Label" style={{ ...inputStyle, fontSize: 12, color: "#888" }} />
          </div>
        ))}
        <button onClick={add} style={{
          border: "1px dashed #333", borderRadius: 8,
          background: "transparent", color: "#555", cursor: "pointer", minHeight: 80,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13
        }}>
          <Icon d={ICONS.plus} size={14} /> Add Stat
        </button>
      </div>
    </div>
  );
}

function ColumnsEditor({ block, onChange }) {
  const leftRef = useRef();
  const rightRef = useRef();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {[
        { key: "left", ref: leftRef, label: "Left Column" },
        { key: "right", ref: rightRef, label: "Right Column" },
      ].map(({ key, ref, label }) => (
        <div key={key}>
          <div style={{
            fontSize: 11, color: "#555", marginBottom: 4, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: 1
          }}>{label}</div>
          <div style={{ border: "1px solid #2a2a2a", borderRadius: 6, overflow: "hidden" }}>
            <RichTextToolbar targetRef={ref} />
            <div ref={ref} contentEditable suppressContentEditableWarning
              onBlur={e => onChange({ [key]: e.currentTarget.innerHTML })}
              dangerouslySetInnerHTML={{ __html: block[key] }}
              style={{
                padding: "10px 12px", minHeight: 80, outline: "none",
                background: "#111", color: "#e5e5e5", fontSize: 13, lineHeight: 1.7
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function CTAEditor({ block, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={block.text} onChange={e => onChange({ text: e.target.value })}
          placeholder="Button label..." style={{ ...inputStyle, flex: 1 }} />
        <input value={block.url} onChange={e => onChange({ url: e.target.value })}
          placeholder="URL" style={{ ...inputStyle, flex: 1 }} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {["primary", "secondary", "outline"].map(s => (
          <button key={s} onClick={() => onChange({ style: s })}
            style={{
              padding: "4px 14px", borderRadius: 4, border: "1px solid",
              borderColor: block.style === s ? "#cc2222" : "#333",
              background: block.style === s ? "#cc2222" : "transparent",
              color: block.style === s ? "#fff" : "#888", cursor: "pointer", fontSize: 12
            }}>
            {s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {["left", "center", "right"].map(a => (
          <button key={a} onClick={() => onChange({ align: a })}
            style={{
              padding: "4px 10px", borderRadius: 4, border: "1px solid",
              borderColor: block.align === a ? "#cc2222" : "#333",
              background: block.align === a ? "#cc2222" : "transparent",
              color: block.align === a ? "#fff" : "#888", cursor: "pointer", fontSize: 12
            }}>
            {a[0].toUpperCase() + a.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

function ListEditor({ block, onChange }) {
  const update = (i, val) => {
    const items = block.items.map((item, idx) => idx === i ? val : item);
    onChange({ items });
  };
  const add = () => onChange({ items: [...block.items, "New item"] });
  const remove = (i) => onChange({ items: block.items.filter((_, idx) => idx !== i) });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
        <button onClick={() => onChange({ ordered: false })}
          style={{
            padding: "4px 12px", borderRadius: 4, border: "1px solid",
            borderColor: !block.ordered ? "#cc2222" : "#333",
            background: !block.ordered ? "#cc2222" : "transparent",
            color: !block.ordered ? "#fff" : "#888", cursor: "pointer", fontSize: 12
          }}>
          Bullet
        </button>
        <button onClick={() => onChange({ ordered: true })}
          style={{
            padding: "4px 12px", borderRadius: 4, border: "1px solid",
            borderColor: block.ordered ? "#cc2222" : "#333",
            background: block.ordered ? "#cc2222" : "transparent",
            color: block.ordered ? "#fff" : "#888", cursor: "pointer", fontSize: 12
          }}>
          Numbered
        </button>
      </div>
      {block.items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ color: "#555", minWidth: 20, fontSize: 12, textAlign: "right" }}>
            {block.ordered ? `${i + 1}.` : "•"}
          </span>
          <input value={item} onChange={e => update(i, e.target.value)}
            style={{ ...inputStyle, flex: 1 }} />
          <button onClick={() => remove(i)} style={{
            background: "none", border: "none",
            color: "#444", cursor: "pointer", padding: 4
          }}>
            <Icon d={ICONS.trash} size={13} />
          </button>
        </div>
      ))}
      <button onClick={add} style={{
        alignSelf: "flex-start", padding: "4px 12px",
        background: "transparent", border: "1px dashed #333", borderRadius: 4,
        color: "#555", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4
      }}>
        <Icon d={ICONS.plus} size={12} /> Add item
      </button>
    </div>
  );
}

// ─── Block Preview ────────────────────────────────────────────────────────────
function BlockPreview({ block }) {
  const s = {
    text: <div dangerouslySetInnerHTML={{ __html: block.html }}
      style={{
        color: "#ccc", fontSize: 14, lineHeight: 1.7,
        maxHeight: 60, overflow: "hidden"
      }} />,
    heading: <div style={{
      fontSize: 16, fontWeight: 700, color: "#fff",
      textAlign: block.align
    }}>{block.text}</div>,
    image: block.url
      ? <img src={block.url} alt="" style={{ height: 48, borderRadius: 4, objectFit: "cover" }} />
      : <span style={{ color: "#444", fontSize: 12 }}>No image set</span>,
    video: <span style={{ color: "#888", fontSize: 12 }}>📹 {block.url || "No URL set"}</span>,
    quote: <span style={{ color: "#888", fontStyle: "italic", fontSize: 13 }}>
      "{block.text.slice(0, 60)}..."
    </span>,
    stats: <div style={{ display: "flex", gap: 12 }}>
      {block.items.slice(0, 4).map((s, i) => (
        <span key={i} style={{ fontSize: 12, color: "#cc2222", fontWeight: 700 }}>
          {s.value} <span style={{ color: "#555" }}>{s.label}</span>
        </span>
      ))}
    </div>,
    columns: <span style={{ color: "#555", fontSize: 12 }}>Two-column layout</span>,
    cta: <span style={{
      padding: "4px 12px", background: "#cc2222", borderRadius: 4,
      color: "#fff", fontSize: 12, display: "inline-block"
    }}>{block.text}</span>,
    divider: <hr style={{ border: "none", borderTop: "1px solid #333", margin: "4px 0" }} />,
    list: <span style={{ color: "#888", fontSize: 12 }}>
      {block.ordered ? "Ordered" : "Bullet"} list ({block.items.length} items)
    </span>,
  };
  return s[block.type] || null;
}

// ─── Rendered Output ──────────────────────────────────────────────────────────
function RenderBlock({ block }) {
  switch (block.type) {
    case "text":
      return <div className="event-content-text"
        dangerouslySetInnerHTML={{ __html: block.html }}
        style={{ color: "#d0d0d0", lineHeight: 1.8, fontSize: 15 }} />;

    case "heading":
      const Tag = block.level;
      const sizes = { h2: "1.8rem", h3: "1.4rem", h4: "1.1rem" };
      return <Tag style={{
        fontSize: sizes[block.level], fontWeight: 700, color: "#fff",
        textAlign: block.align, margin: "0 0 8px",
        borderLeft: block.level === "h2" ? "4px solid #cc2222" : "none",
        paddingLeft: block.level === "h2" ? 14 : 0
      }}>{block.text}</Tag>;

    case "image":
      if (!block.url) return null;
      const wMap = { full: "100%", wide: "85%", medium: "60%" };
      return (
        <figure style={{ margin: 0, textAlign: "center" }}>
          <img src={block.url} alt={block.alt}
            style={{ width: wMap[block.width], borderRadius: 8, display: "block", margin: "0 auto" }} />
          {block.caption && <figcaption style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
            {block.caption}
          </figcaption>}
        </figure>
      );

    case "video":
      const getEmbed = (url) => {
        const yt = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
        const vm = url?.match(/vimeo\.com\/(\d+)/);
        if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
        return null;
      };
      const embed = getEmbed(block.url);
      return embed ? (
        <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "16/9" }}>
          <iframe src={embed} width="100%" height="100%" frameBorder="0"
            allowFullScreen title={block.caption || "video"} style={{ display: "block" }} />
        </div>
      ) : null;

    case "quote":
      return (
        <blockquote style={{
          borderLeft: "4px solid #cc2222", paddingLeft: 20, margin: "0",
          background: "rgba(204,34,34,0.06)", borderRadius: "0 8px 8px 0", padding: "16px 20px"
        }}>
          <p style={{
            fontSize: 17, fontStyle: "italic", color: "#e0e0e0", margin: "0 0 8px",
            lineHeight: 1.7
          }}>&ldquo;{block.text}&rdquo;</p>
          {block.author && <footer style={{ fontSize: 13, color: "#888" }}>
            — <strong style={{ color: "#ccc" }}>{block.author}</strong>
            {block.role && <span> · {block.role}</span>}
          </footer>}
        </blockquote>
      );

    case "stats":
      return (
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${block.items.length}, 1fr)`,
          gap: 1, background: "#cc2222", borderRadius: 8, overflow: "hidden"
        }}>
          {block.items.map((item, i) => (
            <div key={i} style={{ background: "#111", padding: "20px 16px", textAlign: "center" }}>
              <div style={{
                fontSize: "2rem", fontWeight: 800, color: "#cc2222",
                lineHeight: 1
              }}>{item.value}</div>
              <div style={{
                fontSize: 12, color: "#888", marginTop: 4,
                textTransform: "uppercase", letterSpacing: 1
              }}>{item.label}</div>
            </div>
          ))}
        </div>
      );

    case "columns":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div dangerouslySetInnerHTML={{ __html: block.left }}
            style={{ color: "#d0d0d0", lineHeight: 1.8, fontSize: 15 }} />
          <div dangerouslySetInnerHTML={{ __html: block.right }}
            style={{ color: "#d0d0d0", lineHeight: 1.8, fontSize: 15 }} />
        </div>
      );

    case "cta":
      const btnStyles = {
        primary: { background: "#cc2222", color: "#fff", border: "none" },
        secondary: { background: "#1a1a1a", color: "#fff", border: "1px solid #333" },
        outline: { background: "transparent", color: "#cc2222", border: "2px solid #cc2222" },
      };
      return (
        <div style={{ textAlign: block.align }}>
          <a href={block.url}
            style={{
              ...btnStyles[block.style], display: "inline-block",
              padding: "12px 28px", borderRadius: 6, fontWeight: 700,
              fontSize: 15, textDecoration: "none", cursor: "pointer",
              textTransform: "uppercase", letterSpacing: 1
            }}>
            {block.text}
          </a>
        </div>
      );

    case "divider":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #333)" }} />
          <div style={{ width: 6, height: 6, background: "#cc2222", borderRadius: "50%", transform: "rotate(45deg)" }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, #333)" }} />
        </div>
      );

    case "list":
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag style={{
          color: "#d0d0d0", paddingLeft: 22, lineHeight: 1.8,
          margin: 0, fontSize: 15
        }}>
          {block.items.map((item, i) => (
            <li key={i} style={{ marginBottom: 4 }}>{item}</li>
          ))}
        </ListTag>
      );

    default: return null;
  }
}

// ─── Shared style ─────────────────────────────────────────────────────────────
const inputStyle = {
  padding: "8px 10px",
  background: "#0d0d0d",
  border: "1px solid #2a2a2a",
  borderRadius: 6,
  color: "#e5e5e5",
  fontSize: 13,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

// ─── Block Card ───────────────────────────────────────────────────────────────
function BlockCard({ block, index, total, onChange, onDelete, onMove, onDuplicate }) {
  const [expanded, setExpanded] = useState(true);
  const label = BLOCK_TYPES.find(b => b.type === block.type)?.label || block.type;

  const editors = {
    text: <TextEditor block={block} onChange={onChange} />,
    heading: <HeadingEditor block={block} onChange={onChange} />,
    image: <ImageEditor block={block} onChange={onChange} />,
    video: <VideoEditor block={block} onChange={onChange} />,
    quote: <QuoteEditor block={block} onChange={onChange} />,
    stats: <StatsEditor block={block} onChange={onChange} />,
    columns: <ColumnsEditor block={block} onChange={onChange} />,
    cta: <CTAEditor block={block} onChange={onChange} />,
    list: <ListEditor block={block} onChange={onChange} />,
    divider: <div style={{ color: "#555", fontSize: 12, padding: 8 }}>Visual divider — no settings needed</div>,
  };

  return (
    <div style={{
      border: "1px solid #222", borderRadius: 8, overflow: "hidden",
      marginBottom: 8, background: "#0a0a0a", transition: "border-color .2s"
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#333"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", padding: "8px 12px",
        background: "#111", gap: 8, cursor: "pointer"
      }}
        onClick={() => setExpanded(p => !p)}>
        <span style={{
          color: "#cc2222", fontSize: 11, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: 1, minWidth: 80
        }}>{label}</span>
        <div style={{ flex: 1, overflow: "hidden" }}>
          {!expanded && <BlockPreview block={block} />}
        </div>
        <div style={{ display: "flex", gap: 2 }} onClick={e => e.stopPropagation()}>
          <ActionBtn icon={ICONS.up} title="Move Up" disabled={index === 0} onClick={() => onMove(-1)} />
          <ActionBtn icon={ICONS.down} title="Move Down" disabled={index === total - 1} onClick={() => onMove(1)} />
          <ActionBtn icon={ICONS.copy} title="Duplicate" onClick={onDuplicate} />
          <ActionBtn icon={ICONS.trash} title="Delete Block" onClick={onDelete} danger />
        </div>
        <Icon d={expanded ? ICONS.up : ICONS.down} size={14} />
      </div>

      {/* Editor body */}
      {expanded && (
        <div style={{ padding: 12 }}>
          {editors[block.type]}
        </div>
      )}
    </div>
  );
}

function ActionBtn({ icon, title, onClick, disabled, danger }) {
  return (
    <button title={title} onClick={onClick} disabled={disabled}
      style={{
        padding: "4px 6px", background: "transparent", border: "none",
        color: disabled ? "#333" : danger ? "#662222" : "#555",
        cursor: disabled ? "not-allowed" : "pointer", borderRadius: 4,
        transition: "color .15s"
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.color = danger ? "#cc2222" : "#ccc" }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.color = danger ? "#662222" : "#555" }}
    >
      <Icon d={icon} size={14} />
    </button>
  );
}

// ─── Add Block Panel ──────────────────────────────────────────────────────────
function AddBlockPanel({ onAdd }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 8 }}>
      <button onClick={() => setOpen(p => !p)}
        style={{
          width: "100%", padding: "10px", background: "transparent",
          border: "1px dashed #2a2a2a", borderRadius: 8, color: "#555",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          gap: 6, fontSize: 13, transition: "all .2s"
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#cc2222"; e.currentTarget.style.color = "#cc2222"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#555"; }}
      >
        <Icon d={ICONS.plus} size={16} />
        Add Block
      </button>

      {open && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 6, marginTop: 6, padding: 10, background: "#0d0d0d",
          border: "1px solid #222", borderRadius: 8
        }}>
          {BLOCK_TYPES.map(bt => (
            <button key={bt.type}
              onClick={() => { onAdd(bt.type); setOpen(false); }}
              style={{
                padding: "10px 8px", background: "#111", border: "1px solid #222",
                borderRadius: 6, color: "#ccc", cursor: "pointer", textAlign: "left",
                display: "flex", flexDirection: "column", gap: 4, transition: "all .2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#cc2222"; e.currentTarget.style.background = "#1a0a0a"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.background = "#111"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Icon d={bt.icon} size={14} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{bt.label}</span>
              </div>
              <span style={{ fontSize: 10, color: "#555", lineHeight: 1.3 }}>{bt.desc}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EventPageBuilder({ initialBlocks = [], onChange, onSave }) {
  const [blocks, setBlocks] = useState(initialBlocks.length > 0 ? initialBlocks : [
    makeBlock("heading"),
    makeBlock("text"),
  ]);
  const [mode, setMode] = useState("edit"); // edit | preview

  const update = useCallback((id, data) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  }, []);

  const add = useCallback((type) => {
    setBlocks(prev => [...prev, makeBlock(type)]);
  }, []);

  const remove = useCallback((id) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  }, []);

  const move = useCallback((id, dir) => {
    setBlocks(prev => {
      const arr = [...prev];
      const i = arr.findIndex(b => b.id === id);
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  }, []);

  const duplicate = useCallback((id) => {
    setBlocks(prev => {
      const i = prev.findIndex(b => b.id === id);
      const clone = { ...prev[i], id: Math.random().toString(36).slice(2) };
      const arr = [...prev];
      arr.splice(i + 1, 0, clone);
      return arr;
    });
  }, []);

  // Notify parent on change
  useEffect(() => {
    onChange?.(blocks);
  }, [blocks]);

  const save = () => {
    const json = JSON.stringify(blocks, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event-content.json";
    a.click();
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif", color: "#e5e5e5",
      background: "#080808", minHeight: "100vh"
    }}>

      {/* Toolbar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100, display: "flex",
        alignItems: "center", gap: 8, padding: "10px 16px",
        background: "#0d0d0d", borderBottom: "1px solid #1a1a1a",
        boxShadow: "0 2px 12px rgba(0,0,0,.5)"
      }}>
        <Link href={'/admin/dashboard/events'}><ArrowLeft /></Link>
        <span style={{
          fontSize: 13, fontWeight: 700, color: "#cc2222",
          textTransform: "uppercase", letterSpacing: 1.5, marginRight: 8
        }}>
          Page Builder
        </span>
        <span style={{ fontSize: 12, color: "#797979" }}>
          {blocks.length} block{blocks.length !== 1 ? "s" : ""}
        </span>
        <div style={{ flex: 1 }} />

        {/* Mode toggle */}
        <div style={{
          display: "flex", background: "#111", borderRadius: 6,
          border: "1px solid #222", overflow: "hidden"
        }}>
          {["edit", "preview"].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{
                padding: "6px 14px", border: "none", cursor: "pointer",
                background: mode === m ? "#cc2222" : "transparent",
                color: mode === m ? "#fff" : "#666", fontSize: 12, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: .5
              }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Icon d={m === "edit" ? ICONS.edit : ICONS.eye} size={12} />
                {m}
              </span>
            </button>
          ))}
        </div>

        <button onClick={save}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
            background: "#1a3a1a", border: "1px solid #2a4a2a", borderRadius: 6,
            color: "#4aaa4a", cursor: "pointer", fontSize: 12, fontWeight: 600
          }}>
          <Icon d={ICONS.save} size={13} /> Export JSON
        </button>

        <button
          key="save changes"
          onClick={() => onSave(blocks)}
          style={{
            padding: "6px 14px", border: "none", cursor: "pointer",
            background: "#cc2222",
            color: "#fff", fontSize: 12, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: .5,
            borderRadius: 6
          }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, }}>
            Save Content
          </span>
        </button>

      </div>

      <div style={{
        display: "grid", gridTemplateColumns: mode === "edit" ? "1fr 1fr" : "1fr",
        gap: 0, minHeight: "calc(100vh - 48px)", transition: "grid-template-columns .3s"
      }}>

        {/* ─── Editor Panel ─────────────────────────────────────── */}
        {mode === "edit" && (
          <div style={{
            padding: 16, borderRight: "1px solid #1a1a1a",
            overflowY: "auto", maxHeight: "calc(100vh - 48px)"
          }}>
            <div style={{
              fontSize: 11, color: "#444", marginBottom: 12,
              textTransform: "uppercase", letterSpacing: 1, fontWeight: 600
            }}>
              Blocks — drag to reorder
            </div>

            {blocks.map((block, i) => (
              <BlockCard key={block.id} block={block} index={i} total={blocks.length}
                onChange={(data) => update(block.id, data)}
                onDelete={() => remove(block.id)}
                onMove={(dir) => move(block.id, dir)}
                onDuplicate={() => duplicate(block.id)}
              />
            ))}

            <AddBlockPanel onAdd={add} />
          </div>
        )}

        {/* ─── Preview Panel ─────────────────────────────────────── */}
        <div style={{
          padding: mode === "edit" ? "24px 32px" : "40px max(32px, 8vw)",
          overflowY: "auto", maxHeight: "calc(100vh - 48px)",
          background: mode === "preview" ? "#0a0a0a" : "#0d0d0d"
        }}>

          {mode === "preview" && (
            <div style={{
              fontSize: 11, color: "#333", marginBottom: 24, textAlign: "center",
              textTransform: "uppercase", letterSpacing: 2
            }}>
              Preview — Event Content
            </div>
          )}

          <div style={{
            display: "flex", flexDirection: "column", gap: 24,
            maxWidth: mode === "preview" ? 780 : "100%", margin: "0 auto"
          }}>
            {blocks.map(block => (
              <RenderBlock key={block.id} block={block} />
            ))}
          </div>

          {blocks.length === 0 && (
            <div style={{ textAlign: "center", color: "#2a2a2a", marginTop: 80, fontSize: 14 }}>
              No blocks yet — add one from the editor panel
            </div>
          )}
        </div>
      </div>
    </div>
  );
}