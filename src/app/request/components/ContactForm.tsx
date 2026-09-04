"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_METHODS, ENTITY_TYPES } from "@/lib/request";
import { cn } from "@/lib/utils";
import type { ContactMethod, EntityType, RequestContact } from "@/types";
import { DateField } from "./DateField";

interface ContactFormProps {
  submitLabel: string;
  onSubmit: (contact: RequestContact) => void;
}

type Errors = Partial<Record<keyof RequestContact | "consent", string>>;

const emptyContact: RequestContact = {
  fullName: "",
  company: "",
  phone: "",
  email: "",
  inn: "",
  neededBy: "",
  address: "",
  contactMethods: ["phone"],
  entityType: "legal",
  comment: "",
};

/* Телефон храним как есть, а показываем в виде +7 (___) ___-__-__. */
function formatPhone(value: string) {
  const digits = value
    .replace(/\D/g, "")
    .replace(/^8/, "7")
    .replace(/^([^7])/, "7$1");
  const rest = digits.slice(1, 11);

  if (rest.length === 0) return digits ? "+7" : "";

  const parts = [
    rest.slice(0, 3),
    rest.slice(3, 6),
    rest.slice(6, 8),
    rest.slice(8, 10),
  ].filter(Boolean);

  const [code, first, second, third] = parts;
  let formatted = `+7 (${code}`;
  if (rest.length > 3) formatted += `) ${first}`;
  if (rest.length > 6) formatted += `-${second}`;
  if (rest.length > 8) formatted += `-${third}`;

  return formatted;
}

function countDigits(value: string) {
  return value.replace(/\D/g, "").length;
}

function validate(contact: RequestContact, consent: boolean): Errors {
  const errors: Errors = {};

  if (contact.fullName.trim().length < 2) errors.fullName = "Укажите ФИО";
  if (!contact.company.trim()) errors.company = "Укажите название компании";
  if (countDigits(contact.phone) !== 11) errors.phone = "Телефон из 11 цифр";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
    errors.email = "Проверьте адрес почты";

  const inn = countDigits(contact.inn);
  if (inn !== 10 && inn !== 12) errors.inn = "ИНН из 10 или 12 цифр";

  if (!contact.neededBy) errors.neededBy = "Выберите дату";
  if (!contact.address.trim()) errors.address = "Укажите адрес доставки";
  if (contact.contactMethods.length === 0) {
    errors.contactMethods = "Выберите хотя бы один способ связи";
  }
  if (!consent) errors.consent = "Без согласия заявку отправить нельзя";

  return errors;
}

export function ContactForm({ submitLabel, onSubmit }: ContactFormProps) {
  const [contact, setContact] = useState<RequestContact>(emptyContact);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const update = <Key extends keyof RequestContact>(
    key: Key,
    value: RequestContact[Key],
  ) => {
    setContact((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const toggleMethod = (method: ContactMethod, checked: boolean) => {
    update(
      "contactMethods",
      checked
        ? [...contact.contactMethods, method]
        : contact.contactMethods.filter((item) => item !== method),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(contact, consent);
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      const firstInvalid = document.querySelector<HTMLElement>(
        "[aria-invalid='true']",
      );
      firstInvalid?.focus();
      return;
    }

    onSubmit(contact);
  };

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={handleSubmit}>
      <Field data-invalid={Boolean(errors.fullName)}>
        <FieldLabel htmlFor="fullName">
          ФИО <RequiredMark />
        </FieldLabel>
        <Input
          id="fullName"
          className="h-9"
          autoComplete="name"
          placeholder="Введите ваше ФИО"
          value={contact.fullName}
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          onChange={(event) => update("fullName", event.target.value)}
        />
        <FieldError id="fullName-error">{errors.fullName}</FieldError>
      </Field>

      <Field data-invalid={Boolean(errors.company)}>
        <FieldLabel htmlFor="company">
          Название компании <RequiredMark />
        </FieldLabel>
        <Input
          id="company"
          className="h-9"
          autoComplete="organization"
          placeholder="ООО «Ромашка»"
          value={contact.company}
          aria-invalid={Boolean(errors.company)}
          aria-describedby={errors.company ? "company-error" : undefined}
          onChange={(event) => update("company", event.target.value)}
        />
        <FieldError id="company-error">{errors.company}</FieldError>
      </Field>

      <Field data-invalid={Boolean(errors.phone)}>
        <FieldLabel htmlFor="phone">
          Телефон <RequiredMark />
        </FieldLabel>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          className="h-9"
          autoComplete="tel"
          placeholder="+7 (___) ___-__-__"
          value={contact.phone}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          onChange={(event) => update("phone", formatPhone(event.target.value))}
        />
        <FieldError id="phone-error">{errors.phone}</FieldError>
      </Field>

      <Field data-invalid={Boolean(errors.email)}>
        <FieldLabel htmlFor="email">
          E-mail <RequiredMark />
        </FieldLabel>
        <Input
          id="email"
          type="email"
          className="h-9"
          autoComplete="email"
          placeholder="example@mail.ru"
          value={contact.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          onChange={(event) => update("email", event.target.value)}
        />
        <FieldError id="email-error">{errors.email}</FieldError>
      </Field>

      <Field data-invalid={Boolean(errors.inn)}>
        <FieldLabel htmlFor="inn">
          ИНН <RequiredMark />
        </FieldLabel>
        <Input
          id="inn"
          inputMode="numeric"
          className="h-9"
          placeholder="10 или 12 цифр"
          value={contact.inn}
          maxLength={12}
          aria-invalid={Boolean(errors.inn)}
          aria-describedby={errors.inn ? "inn-error" : undefined}
          onChange={(event) =>
            update("inn", event.target.value.replace(/\D/g, ""))
          }
        />
        <FieldError id="inn-error">{errors.inn}</FieldError>
      </Field>

      <Field data-invalid={Boolean(errors.neededBy)}>
        <FieldLabel htmlFor="neededBy">
          Когда нужно получить заказ? <RequiredMark />
        </FieldLabel>
        <DateField
          id="neededBy"
          value={contact.neededBy}
          invalid={Boolean(errors.neededBy)}
          describedBy={errors.neededBy ? "neededBy-error" : undefined}
          onChange={(value) => update("neededBy", value)}
        />
        <FieldError id="neededBy-error">{errors.neededBy}</FieldError>
      </Field>

      <Field data-invalid={Boolean(errors.address)}>
        <FieldLabel htmlFor="address">
          Адрес доставки <RequiredMark />
        </FieldLabel>
        <Textarea
          id="address"
          className="min-h-19"
          autoComplete="street-address"
          placeholder="Укажите адрес доставки"
          value={contact.address}
          aria-invalid={Boolean(errors.address)}
          aria-describedby={errors.address ? "address-error" : undefined}
          onChange={(event) => update("address", event.target.value)}
        />
        <FieldError id="address-error">{errors.address}</FieldError>
      </Field>

      <fieldset
        className="flex flex-col gap-2"
        aria-invalid={Boolean(errors.contactMethods)}
        aria-describedby={
          errors.contactMethods ? "contactMethods-error" : undefined
        }
      >
        <legend className="mb-2 text-sm font-medium text-foreground">
          Способы связи <RequiredMark />
        </legend>
        <div className="flex flex-col gap-1">
          {CONTACT_METHODS.map((method) => (
            <div key={method.value} className="flex h-6 items-center gap-2">
              <Checkbox
                id={`method-${method.value}`}
                checked={contact.contactMethods.includes(method.value)}
                onCheckedChange={(checked) =>
                  toggleMethod(method.value, checked === true)
                }
              />
              <Label htmlFor={`method-${method.value}`}>{method.label}</Label>
            </div>
          ))}
        </div>
        <FieldError id="contactMethods-error">
          {errors.contactMethods}
        </FieldError>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-foreground">
          Юридическое / Физическое лицо <RequiredMark />
        </legend>
        <RadioGroup
          value={contact.entityType}
          onValueChange={(value) => update("entityType", value as EntityType)}
          className="gap-1"
        >
          {ENTITY_TYPES.map((type) => (
            <div key={type.value} className="flex items-center gap-2">
              <RadioGroupItem id={`entity-${type.value}`} value={type.value} />
              <Label htmlFor={`entity-${type.value}`}>{type.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </fieldset>

      <Field>
        <FieldLabel htmlFor="comment">Комментарий к заявке</FieldLabel>
        <Textarea
          id="comment"
          className="min-h-19"
          placeholder="Пожелания, детали заказа и другая важная информация"
          value={contact.comment}
          onChange={(event) => update("comment", event.target.value)}
        />
      </Field>

      <Field data-invalid={Boolean(errors.consent)}>
        <div className="flex items-start gap-2">
          <Checkbox
            id="consent"
            checked={consent}
            className="mt-0.5"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            onCheckedChange={(checked) => {
              setConsent(checked === true);
              setErrors((current) => ({ ...current, consent: undefined }));
            }}
          />
          <Label htmlFor="consent" className="font-normal">
            <span>
              Я согласен на{" "}
              <span className="font-semibold">
                обработку персональных данных
              </span>
              <RequiredMark className="ml-1" />
            </span>
          </Label>
        </div>
        <FieldError id="consent-error">{errors.consent}</FieldError>
      </Field>

      <Button type="submit" size="lg" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}

function RequiredMark({ className }: { className?: string }) {
  return (
    <span className={cn("text-destructive", className)} aria-hidden="true">
      *
    </span>
  );
}
