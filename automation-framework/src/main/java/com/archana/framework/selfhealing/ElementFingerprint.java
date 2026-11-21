package com.archana.framework.selfhealing;

import com.microsoft.playwright.Locator;
import java.util.*;

/** Safe, value-free snapshot of the attributes used to recognize an element. */
public final class ElementFingerprint {
    private final Map<String, String> attributes;

    public ElementFingerprint(Map<String, String> attributes) {
        Map<String, String> copy = new LinkedHashMap<>();
        if (attributes != null) attributes.forEach((k, v) -> copy.put(k, v == null ? "" : v));
        this.attributes = Collections.unmodifiableMap(copy);
    }

    public static Builder builder() { return new Builder(); }
    public String get(String key) { return attributes.getOrDefault(key, ""); }
    public Map<String, String> attributes() { return attributes; }

    /** Captures DOM metadata only; never reads input values or typed credentials. */
    public static ElementFingerprint capture(Locator locator) {
        Object raw = locator.evaluate("e => ({tag:e.tagName.toLowerCase(), id:e.id, name:e.getAttribute('name')||'', text:(e.innerText||e.getAttribute('aria-label')||'').trim(), type:e.getAttribute('type')||'', placeholder:e.getAttribute('placeholder')||'', ariaLabel:e.getAttribute('aria-label')||'', role:e.getAttribute('role')||({button:'button',a:'link',input:['button','submit','reset'].includes(e.type)?'button':e.type==='checkbox'?'checkbox':e.type==='radio'?'radio':e.type==='search'?'searchbox':e.type==='email'||e.type==='text'?'textbox':'',textarea:'textbox'}[e.tagName.toLowerCase()]||''), title:e.getAttribute('title')||'', testId:e.getAttribute('data-testid')||'', classes:typeof e.className==='string'?e.className:'', contenteditable:e.getAttribute('contenteditable')||'', parent:(e.parentElement?.tagName.toLowerCase()||'')+' '+(e.parentElement?.id||'')+' '+(e.parentElement?.getAttribute('role')||'')+' '+(e.parentElement?.getAttribute('aria-label')||'')+' '+(e.parentElement?.getAttribute('data-testid')||'')})");
        @SuppressWarnings("unchecked") Map<String, Object> values = (Map<String, Object>) raw;
        Map<String, String> result = new LinkedHashMap<>();
        values.forEach((key, value) -> result.put(key, value == null ? "" : String.valueOf(value)));
        return new ElementFingerprint(result);
    }

    public static final class Builder {
        private final Map<String, String> values = new LinkedHashMap<>();
        public Builder tag(String v) { return put("tag", v); }
        public Builder id(String v) { return put("id", v); }
        public Builder name(String v) { return put("name", v); }
        public Builder text(String v) { return put("text", v); }
        public Builder type(String v) { return put("type", v); }
        public Builder placeholder(String v) { return put("placeholder", v); }
        public Builder ariaLabel(String v) { return put("ariaLabel", v); }
        public Builder role(String v) { return put("role", v); }
        public Builder title(String v) { return put("title", v); }
        public Builder testId(String v) { return put("testId", v); }
        public Builder classes(String v) { return put("classes", v); }
        public Builder parent(String v) { return put("parent", v); }
        public Builder contenteditable(String v) { return put("contenteditable", v); }
        public Builder put(String key, String value) { values.put(key, value == null ? "" : value); return this; }
        public ElementFingerprint build() { return new ElementFingerprint(values); }
    }
}
