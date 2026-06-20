"use client";

import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { contactLinks, links } from "@/src/config/links";
import { pricing } from "@/src/config/pricing";

type ContactLink = (typeof contactLinks)[number];

type PreviewFile = {
  id: string;
  name: string;
  url: string;
  file: File;
};

type FormState = {
  references: PreviewFile[];
  projectType: string;
  size: string;
  budget: string;
  paint: string;
  details: string;
  name: string;
  lineId: string;
  phone: string;
  facebook: string;
  instagram: string;
  preferredContact: string;
};

const projectTypes = ["ตัวละคร", "คนจริง", "สัตว์เลี้ยง", "Mascot", "อื่น ๆ"];
const sizeOptions = [
  pricing["30"].label,
  pricing["60"].label,
  pricing["100"].label,
  pricing["170"].label,
  "ยังไม่แน่ใจ",
];
const budgetOptions = [
  "ต่ำกว่า 5,000 บาท",
  "5,000 - 15,000 บาท",
  "15,000 - 30,000 บาท",
  "30,000 บาทขึ้นไป",
];
const paintOptions = ["ไม่ทำสี", "สีพื้น", "ทำสีเต็ม", "ยังไม่แน่ใจ"];
const preferredContactOptions = ["Facebook", "Instagram", "TikTok", "LINE", "โทรศัพท์"];

const initialForm: FormState = {
  references: [],
  projectType: "",
  size: pricing["100"].label,
  budget: "",
  paint: "",
  details: "",
  name: "",
  lineId: "",
  phone: "",
  facebook: "",
  instagram: "",
  preferredContact: "",
};

export default function DreamProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      form.references.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [form.references]);

  const submittedData = useMemo(
    () => ({
      name: form.name,
      phone: form.phone,
      lineId: form.lineId,
      facebook: form.facebook,
      instagram: form.instagram,
      preferredContact: form.preferredContact,
      projectType: form.projectType,
      selectedSize: form.size,
      budget: form.budget,
      finishType: form.paint,
      description: form.details,
      pageSource: "dream-project",
    }),
    [form],
  );

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const availableSlots = 10 - form.references.length;
    const acceptedFiles = files.slice(0, Math.max(availableSlots, 0));

    if (!acceptedFiles.length) {
      setSubmitError("อัปโหลดรูปได้สูงสุด 10 รูป");
      event.target.value = "";
      return;
    }

    const nextFiles = acceptedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));

    setForm((current) => ({
      ...current,
      references: [...current.references, ...nextFiles],
    }));

    if (files.length > acceptedFiles.length) {
      setSubmitError("อัปโหลดรูปได้สูงสุด 10 รูป ระบบเพิ่มเฉพาะรูปแรก ๆ ให้แล้ว");
    } else {
      setSubmitError("");
    }

    event.target.value = "";
  };

  const removeFile = (id: string) => {
    setForm((current) => {
      const target = current.references.find((file) => file.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
      }

      return {
        ...current,
        references: current.references.filter((file) => file.id !== id),
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      let uploadedImageUrls: string[] = [];

      if (form.references.length) {
        const uploadBody = new FormData();
        form.references.forEach((reference) => {
          uploadBody.append("images", reference.file);
        });

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadBody,
        });
        const uploadResult = (await uploadResponse.json()) as {
          ok?: boolean;
          urls?: string[];
          message?: string;
        };

        if (!uploadResponse.ok || !uploadResult.ok) {
          throw new Error(uploadResult.message || "Upload failed");
        }

        uploadedImageUrls = uploadResult.urls ?? [];
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...submittedData, uploadedImageUrls }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        mode?: "google-sheet" | "mock";
        message?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Submit failed");
      }

      console.log("Dream project submitted", { ...submittedData, uploadedImageUrls, mode: result.mode });
      setSubmitted(true);
      router.push("/thank-you");
    } catch (error) {
      console.error("Dream project submit error", error);
      setSubmitError("ส่งข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง หรือทัก inbox ช่องทางที่สะดวกได้ทันที");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-void font-thai text-ivory">
      <DreamNav />
      <FloatingContacts />

      <section className="px-5 pb-10 pt-14 md:px-10 md:pb-16 md:pt-20 xl:px-16">
        <div className="mx-auto max-w-[1120px]">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-gold">
            DREAM PROJECT
          </p>
          <h1 className="max-w-5xl text-[clamp(3.2rem,9vw,7.5rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
            เริ่มโปรเจกต์ของคุณ
          </h1>
          <p className="mt-7 max-w-3xl whitespace-pre-line text-xl font-medium leading-9 text-mist md:text-2xl">
            ส่งรูปอ้างอิง เลือกขนาด และบอกไอเดียของคุณ{"\n"}
            เราจะช่วยประเมินว่าควรเริ่มจากแบบไหน
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="px-5 pb-16 md:px-10 md:pb-24 xl:px-16">
        <div className="mx-auto grid max-w-[1120px] gap-5">
          <FormSection eyebrow="UPLOAD REFERENCE" title="Upload Reference">
            <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gold/45 bg-gallery p-6 text-center shadow-[var(--soft-shadow)] transition hover:-translate-y-0.5 hover:border-gold">
              <ImagePlus className="mb-4 text-gold" size={36} />
              <span className="text-xl font-semibold tracking-[-0.02em]">
                อัปโหลดรูปอ้างอิง
              </span>
              <span className="mt-2 max-w-md text-sm leading-6 text-mist">
                เลือกรูปตัวละคร รูปคนจริง สัตว์เลี้ยง หรือภาพไอเดียได้หลายรูป
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="sr-only"
              />
            </label>

            {form.references.length ? (
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {form.references.map((file) => (
                  <figure
                    key={file.id}
                    className="overflow-hidden rounded-xl border border-[var(--line)] bg-[#F5F1EA]"
                  >
                    <div className="flex aspect-square items-center justify-center p-2">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="block h-full w-full object-contain object-center"
                      />
                    </div>
                    <figcaption className="flex items-center justify-between gap-2 border-t border-[var(--line)] p-2 text-xs font-semibold text-mist">
                      <span className="truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="shrink-0 rounded-full bg-gallery px-2 py-1 text-[#17130f]"
                      >
                        ลบ
                      </button>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : null}
          </FormSection>

          <FormSection title="เลือกประเภทงาน">
            <ChoiceGrid
              options={projectTypes}
              selected={form.projectType}
              onSelect={(value) => updateField("projectType", value)}
            />
          </FormSection>

          <FormSection title="เลือกขนาด">
            <ChoiceGrid
              options={sizeOptions}
              selected={form.size}
              onSelect={(value) => updateField("size", value)}
            />
          </FormSection>

          <FormSection title="งบประมาณ">
            <ChoiceGrid
              options={budgetOptions}
              selected={form.budget}
              onSelect={(value) => updateField("budget", value)}
            />
          </FormSection>

          <FormSection title="ทำสีหรือไม่">
            <ChoiceGrid
              options={paintOptions}
              selected={form.paint}
              onSelect={(value) => updateField("paint", value)}
            />
          </FormSection>

          <FormSection title="รายละเอียดเพิ่มเติม">
            <textarea
              value={form.details}
              onChange={(event) => updateField("details", event.target.value)}
              rows={6}
              placeholder="เล่าไอเดีย ขนาดที่อยากได้ รายละเอียดที่สำคัญ หรือข้อจำกัดของพื้นที่วางงาน"
              className="w-full resize-none rounded-2xl border border-[var(--line)] bg-gallery p-5 text-base font-medium leading-7 text-ivory outline-none transition focus:border-gold"
            />
          </FormSection>

          <FormSection title="Contact information">
            <div className="grid gap-3 md:grid-cols-3">
              <TextField
                label="ชื่อ"
                value={form.name}
                onChange={(value) => updateField("name", value)}
              />
              <TextField
                label="LINE ID"
                value={form.lineId}
                onChange={(value) => updateField("lineId", value)}
              />
              <TextField
                label="เบอร์โทร"
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
              />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <TextField
                label="Facebook"
                value={form.facebook}
                onChange={(value) => updateField("facebook", value)}
              />
              <TextField
                label="Instagram"
                value={form.instagram}
                onChange={(value) => updateField("instagram", value)}
              />
            </div>
            <div className="mt-5">
              <p className="mb-3 text-sm font-bold text-mist">ช่องทางที่สะดวกที่สุด</p>
              <ChoiceGrid
                options={preferredContactOptions}
                selected={form.preferredContact}
                onSelect={(value) => updateField("preferredContact", value)}
              />
            </div>
          </FormSection>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-gold px-8 py-4 text-sm font-bold text-[var(--button-text)] shadow-[0_12px_30px_rgba(185,130,43,0.22)] transition hover:-translate-y-0.5 hover:bg-gold-light"
            >
              {isSubmitting ? "กำลังส่งข้อมูล..." : "ส่งโปรเจกต์ให้ประเมิน"}
            </button>
          </div>

          {submitError ? (
            <p className="text-center text-sm font-bold text-[#a9432f]">{submitError}</p>
          ) : null}

          {submitted ? <SuccessContactOptions /> : null}
        </div>
      </form>

      <section className="px-5 pb-20 md:px-10 md:pb-28 xl:px-16">
        <div className="mx-auto max-w-[1120px] rounded-3xl border border-[var(--line)] bg-gallery p-7 text-center shadow-[var(--soft-shadow)] md:p-12">
          <h2 className="mx-auto max-w-4xl text-[clamp(2.5rem,5vw,5.6rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
            พร้อมเปลี่ยนไอเดียในหัว ให้กลายเป็นของจริงหรือยัง?
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/dream-project">เริ่มโปรเจกต์ของคุณ</Button>
            <Button href="/story" variant="secondary">
              ดูผลงานเพิ่มเติม
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function DreamNav() {
  return (
    <header className="border-b border-[var(--line)] bg-void/82 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10 xl:px-16">
        <Link href="/" className="font-display text-lg tracking-wide">
          Collector Dream Factory
        </Link>
        <div className="hidden items-center gap-7 text-sm font-semibold text-mist md:flex">
          <Link href="/#collections" className="transition hover:text-ivory">
            คอลเลกชัน
          </Link>
          <Link href="/story" className="transition hover:text-ivory">
            เรื่องราว
          </Link>
          <Link href="/dream-project" className="text-ivory">
            เริ่มโปรเจกต์
          </Link>
        </div>
      </nav>
    </header>
  );
}

function FormSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-[var(--line)] bg-gallery p-5 shadow-[var(--soft-shadow)] md:p-7">
      {eyebrow ? (
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-gold">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mb-5 text-[clamp(1.8rem,3vw,3rem)] font-semibold leading-tight tracking-[-0.04em]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ChoiceGrid({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={cn(
            "min-h-20 rounded-2xl border px-4 py-4 text-left text-base font-bold transition",
            selected === option
              ? "border-gold bg-gold text-[var(--button-text)] shadow-[0_12px_28px_rgba(185,130,43,0.18)]"
              : "border-[var(--line)] bg-[#F5F1EA] text-ivory hover:border-gold/50",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-mist">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 rounded-2xl border border-[var(--line)] bg-[#F5F1EA] px-4 text-base font-semibold text-ivory outline-none transition focus:border-gold"
      />
    </label>
  );
}

function SuccessContactOptions() {
  const quickContacts = ["Facebook Messenger", "Instagram", "TikTok", "LINE Official"]
    .map((platform) => contactLinks.find((contact) => contact.platform === platform))
    .filter((contact): contact is ContactLink => Boolean(contact));

  return (
    <section className="rounded-3xl border border-gold/35 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(239,231,220,0.88))] p-5 shadow-[var(--soft-shadow)] md:p-7">
      <div className="mb-6 flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-[var(--button-text)]">
          <Check size={20} />
        </span>
        <div>
          <h2 className="text-[clamp(1.8rem,3vw,3rem)] font-semibold leading-tight tracking-[-0.04em]">
            ได้รับข้อมูลแล้ว
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-7 text-mist">
            เราจะติดต่อกลับผ่านช่องทางที่คุณสะดวกที่สุด
          </p>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-gold">
            ถ้าต้องการคุยเร็ว สามารถทัก inbox ช่องทางที่สะดวกได้ทันที
          </p>
        </div>
      </div>
      <ContactCards contacts={quickContacts} />
    </section>
  );
}

function ContactCards({ contacts = contactLinks }: { contacts?: readonly ContactLink[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {contacts.map((contact) => (
        <a
          key={contact.platform}
          href={contact.href}
          target="_blank"
          rel="noreferrer"
          className="group rounded-2xl border border-[var(--line)] bg-gallery p-4 transition hover:-translate-y-0.5 hover:border-gold/50"
        >
          <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F5F1EA] text-sm font-black text-gold">
            {contact.shortLabel}
          </span>
          <h3 className="text-lg font-bold leading-tight">{contact.platform}</h3>
          <p className="mt-1 text-sm font-semibold text-gold">{contact.handle}</p>
          <p className="mt-3 min-h-16 text-sm leading-6 text-mist">
            {contact.description}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ivory group-hover:text-gold">
            เปิดช่องทางนี้ <ArrowRight size={15} />
          </span>
        </a>
      ))}
    </div>
  );
}

function FloatingContacts() {
  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2 md:bottom-7 md:right-7">
      {contactLinks.slice(0, 4).map((contact, index) => (
        <a
          key={contact.platform}
          href={contact.href}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex h-12 items-center gap-3 rounded-full border border-[var(--line)] bg-gallery/92 px-3 text-sm font-bold text-ivory shadow-[0_12px_34px_rgba(72,50,24,0.16)] backdrop-blur transition hover:-translate-y-0.5 hover:border-gold"
          style={{ transitionDelay: `${index * 35}ms` }}
          aria-label={contact.platform}
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold text-[11px] font-black text-[var(--button-text)]">
            {contact.shortLabel}
          </span>
          <span className="hidden pr-1 md:block">{contact.platform}</span>
        </a>
      ))}
    </div>
  );
}
