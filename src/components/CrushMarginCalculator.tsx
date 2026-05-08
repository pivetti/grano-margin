"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  calcularCrushMargin,
  type CalculationMode,
  type CrushMarginInput,
} from "@/lib/calcular-crush-margin";
import {
  formatCurrencyBRL,
  formatPercent,
  parseNumberInput,
} from "@/lib/formatters";
import type { CrushMarginHistoryItem } from "@/types/crush-margin";
import { Button } from "./Button";
import { ConfirmDialog } from "./ConfirmDialog";
import { ConversionPreview } from "./ConversionPreview";
import { ExternalMarketLinks } from "./crush/ExternalMarketLinks";
import { FormulaExplainer } from "./FormulaExplainer";
import { HistoryTable } from "./HistoryTable";
import { InputField } from "./InputField";
import { ResultCard } from "./ResultCard";
import { StatusBadge } from "./StatusBadge";
import { Toast } from "./Toast";

type DolarSource = "BCB_PTAX" | "AWESOME_API" | "MANUAL_REQUIRED";

type DolarApiResponse = {
  success: boolean;
  source: DolarSource;
  cotacaoCompra: number | null;
  cotacaoVenda: number | null;
  cotacaoUsada: number | null;
  dataHoraCotacao: string | null;
  message: string;
};

type NumericField =
  | "precoSojaSaca"
  | "precoFareloTon"
  | "precoOleoTon"
  | "cotacaoDolar"
  | "sojaUsdPorBushel"
  | "fareloUsdPorShortTon"
  | "oleoCentsPorLibra"
  | "kgFareloPorSaca"
  | "kgOleoPorSaca"
  | "custosOperacionaisPorSaca";

type FieldErrors = Partial<Record<NumericField, string>>;
type FormState = Record<NumericField, string> & {
  mode: CalculationMode;
  observacoes: string;
};

type FieldConfig = {
  name: NumericField;
  label: string;
  prefix?: string;
  suffix?: string;
  helper?: string;
};

type AuthUser = {
  id: string;
  nome: string;
  email: string;
};

const LOCAL_HISTORY_KEY = "granomargin:local-history";

const defaultForm: FormState = {
  mode: "CBOT",
  precoSojaSaca: "127,38",
  precoFareloTon: "1670",
  precoOleoTon: "6250",
  cotacaoDolar: "4,9079",
  sojaUsdPorBushel: "11,77",
  fareloUsdPorShortTon: "320,85",
  oleoCentsPorLibra: "74,10",
  kgFareloPorSaca: "46,8",
  kgOleoPorSaca: "11,4",
  custosOperacionaisPorSaca: "0",
  observacoes: "",
};

const modeOptions: Array<{
  mode: CalculationMode;
  label: string;
  description: string;
}> = [
  {
    mode: "CBOT",
    label: "CBOT / Mercado internacional",
    description:
      "Use soja em US$/bushel, farelo em US$/short ton, oleo em US¢/libra e dolar PTAX.",
  },
  {
    mode: "BRL",
    label: "Precos manuais em R$",
    description:
      "Use precos finais ja convertidos: soja em R$/saca, farelo em R$/ton e oleo em R$/ton.",
  },
];

const commonFields: FieldConfig[] = [
  {
    name: "kgFareloPorSaca",
    label: "Rendimento do farelo",
    suffix: "kg/saca",
    helper: "Editavel conforme processo, qualidade, umidade e metodologia.",
  },
  {
    name: "kgOleoPorSaca",
    label: "Rendimento do oleo",
    suffix: "kg/saca",
    helper: "Volume produzido a partir de uma saca de 60 kg.",
  },
  {
    name: "custosOperacionaisPorSaca",
    label: "Custos operacionais",
    prefix: "R$",
    suffix: "saca",
    helper: "Pode ser zero neste MVP, mas nao pode ser negativo.",
  },
];

const fieldsByMode: Record<CalculationMode, FieldConfig[]> = {
  BRL: [
    {
      name: "precoSojaSaca",
      label: "Preco da soja em grao",
      prefix: "R$",
      suffix: "saca",
    },
    {
      name: "precoFareloTon",
      label: "Preco do farelo de soja",
      prefix: "R$",
      suffix: "ton",
    },
    {
      name: "precoOleoTon",
      label: "Preco do oleo de soja",
      prefix: "R$",
      suffix: "ton",
    },
    ...commonFields,
  ],
  CBOT: [
    {
      name: "cotacaoDolar",
      label: "Cotacao do dolar",
      prefix: "R$",
      suffix: "US$",
      helper: "Campo manual neste MVP. A cotacao PTAX pode entrar futuramente.",
    },
    {
      name: "sojaUsdPorBushel",
      label: "Soja CBOT — US$/bushel",
      prefix: "US$",
      suffix: "bushel",
      helper:
        "Consulte a fonte externa e informe a soja em US$/bushel. Ex.: 11,77.",
    },
    {
      name: "fareloUsdPorShortTon",
      label: "Farelo CBOT",
      prefix: "US$",
      suffix: "short ton",
      helper:
        "Consulte a fonte externa e informe o farelo em US$/short ton. Ex.: 320,85.",
    },
    {
      name: "oleoCentsPorLibra",
      label: "Oleo CBOT",
      prefix: "US¢",
      suffix: "libra",
      helper:
        "Consulte a fonte externa e informe o oleo em centavos de dolar por libra. Ex.: 74,10.",
    },
    ...commonFields,
  ],
};

function toInputValue(value: number) {
  return String(value).replace(".", ",");
}

function parseFormNumber(form: FormState, field: NumericField) {
  return parseNumberInput(form[field]);
}

function buildInput(form: FormState): CrushMarginInput {
  const base = {
    kgFareloPorSaca: parseFormNumber(form, "kgFareloPorSaca"),
    kgOleoPorSaca: parseFormNumber(form, "kgOleoPorSaca"),
    custosOperacionaisPorSaca: parseFormNumber(
      form,
      "custosOperacionaisPorSaca",
    ),
  };

  if (form.mode === "BRL") {
    return {
      mode: "BRL",
      ...base,
      precoSojaSaca: parseFormNumber(form, "precoSojaSaca"),
      precoFareloTon: parseFormNumber(form, "precoFareloTon"),
      precoOleoTon: parseFormNumber(form, "precoOleoTon"),
    };
  }

  return {
    mode: "CBOT",
    ...base,
    cotacaoDolar: parseFormNumber(form, "cotacaoDolar"),
    sojaUsdPorBushel: parseFormNumber(form, "sojaUsdPorBushel"),
    fareloUsdPorShortTon: parseFormNumber(form, "fareloUsdPorShortTon"),
    oleoCentsPorLibra: parseFormNumber(form, "oleoCentsPorLibra"),
  };
}

function validateInput(input: CrushMarginInput) {
  const errors: FieldErrors = {};

  const markNonNegative = (field: NumericField, value: number) => {
    if (!Number.isFinite(value)) {
      errors[field] = "Informe um numero valido.";
    } else if (value < 0) {
      errors[field] = "O valor nao pode ser negativo.";
    }
  };

  const markPositive = (field: NumericField, value: number, message: string) => {
    if (!Number.isFinite(value)) {
      errors[field] = "Informe um numero valido.";
    } else if (value <= 0) {
      errors[field] = message;
    }
  };

  markPositive(
    "kgFareloPorSaca",
    input.kgFareloPorSaca,
    "O rendimento precisa ser maior que zero.",
  );
  markPositive(
    "kgOleoPorSaca",
    input.kgOleoPorSaca,
    "O rendimento precisa ser maior que zero.",
  );
  markNonNegative(
    "custosOperacionaisPorSaca",
    input.custosOperacionaisPorSaca,
  );

  if (input.mode === "BRL") {
    markNonNegative("precoSojaSaca", input.precoSojaSaca);
    markNonNegative("precoFareloTon", input.precoFareloTon);
    markNonNegative("precoOleoTon", input.precoOleoTon);
  } else {
    markPositive(
      "cotacaoDolar",
      input.cotacaoDolar,
      "A cotacao do dolar precisa ser maior que zero.",
    );
    markNonNegative("sojaUsdPorBushel", input.sojaUsdPorBushel);
    markNonNegative("fareloUsdPorShortTon", input.fareloUsdPorShortTon);
    markNonNegative("oleoCentsPorLibra", input.oleoCentsPorLibra);
  }

  return errors;
}

function getModeDescription(mode: CalculationMode) {
  if (mode === "CBOT") {
    return "Use soja em US$/bushel, farelo em US$/short ton, oleo em US¢/libra e dolar PTAX. A cotacao do dolar pode ser buscada automaticamente ou sobrescrita manualmente.";
  }

  return "Use precos finais ja convertidos: soja em R$/saca, farelo em R$/ton e oleo em R$/ton.";
}

function formFromInput(input: CrushMarginInput, observacoes: string): FormState {
  const nextForm = {
    ...defaultForm,
    mode: input.mode,
    kgFareloPorSaca: toInputValue(input.kgFareloPorSaca),
    kgOleoPorSaca: toInputValue(input.kgOleoPorSaca),
    custosOperacionaisPorSaca: toInputValue(input.custosOperacionaisPorSaca),
    observacoes,
  };

  if (input.mode === "BRL") {
    return {
      ...nextForm,
      precoSojaSaca: toInputValue(input.precoSojaSaca),
      precoFareloTon: toInputValue(input.precoFareloTon),
      precoOleoTon: toInputValue(input.precoOleoTon),
    };
  }

  return {
    ...nextForm,
    cotacaoDolar: toInputValue(input.cotacaoDolar),
    sojaUsdPorBushel: toInputValue(input.sojaUsdPorBushel),
    fareloUsdPorShortTon: toInputValue(input.fareloUsdPorShortTon),
    oleoCentsPorLibra: toInputValue(input.oleoCentsPorLibra),
  };
}

function createLocalId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `local-${crypto.randomUUID()}`;
  }

  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readLocalHistory() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawHistory = window.localStorage.getItem(LOCAL_HISTORY_KEY);
    const parsed = rawHistory ? JSON.parse(rawHistory) : [];

    return Array.isArray(parsed) ? (parsed as CrushMarginHistoryItem[]) : [];
  } catch {
    return [];
  }
}

function writeLocalHistory(items: CrushMarginHistoryItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(items));
}

function formatRateInput(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
}

function getDolarSourceLabel(source: DolarSource) {
  if (source === "BCB_PTAX") {
    return "Banco Central PTAX";
  }

  if (source === "AWESOME_API") {
    return "AwesomeAPI";
  }

  return "Manual";
}

function getDolarFieldHelper(
  defaultHelper: string | undefined,
  feedback: string,
  source: DolarSource | null,
) {
  if (feedback && source && source !== "MANUAL_REQUIRED") {
    return `${feedback} Fonte: ${getDolarSourceLabel(source)}. Voce pode sobrescrever manualmente.`;
  }

  if (feedback) {
    return feedback;
  }

  return defaultHelper;
}

function normalizeLegacyInput(input: CrushMarginInput): CrushMarginInput {
  if (input.mode !== "CBOT") {
    return input;
  }

  const legacyInput = input as Extract<CrushMarginInput, { mode: "CBOT" }> & {
    sojaCentsPorBushel?: number;
  };

  if (
    typeof legacyInput.sojaUsdPorBushel === "number" &&
    Number.isFinite(legacyInput.sojaUsdPorBushel)
  ) {
    return input;
  }

  if (
    typeof legacyInput.sojaCentsPorBushel === "number" &&
    Number.isFinite(legacyInput.sojaCentsPorBushel)
  ) {
    return {
      ...input,
      sojaUsdPorBushel: legacyInput.sojaCentsPorBushel / 100,
    };
  }

  return input;
}

export function CrushMarginCalculator() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [history, setHistory] = useState<CrushMarginHistoryItem[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [dolarLoading, setDolarLoading] = useState(false);
  const [dolarFeedback, setDolarFeedback] = useState("");
  const [dolarSource, setDolarSource] = useState<DolarSource | null>(null);

  const calculation = useMemo(() => {
    const input = buildInput(form);
    const errors = validateInput(input);
    const isValid = Object.keys(errors).length === 0;

    return {
      input,
      errors,
      isValid,
      result: isValid ? calcularCrushMargin(input) : null,
    };
  }, [form]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);

    const response = await fetch("/api/crush-historicos", {
      method: "GET",
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json().catch(() => null);
      setHistory(Array.isArray(data?.historicos) ? data.historicos : []);
    } else {
      setHistory([]);
    }

    setHistoryLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);
      const currentUser = data?.user ?? null;

      if (cancelled) {
        return;
      }

      setUser(currentUser);
      setAuthLoaded(true);

      if (currentUser) {
        await loadHistory();
      } else {
        setHistory(readLocalHistory());
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, [loadHistory]);

  function updateField(name: NumericField | "observacoes", value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateMode(mode: CalculationMode) {
    setForm((current) => ({
      ...current,
      mode,
    }));
  }

  function resetDefaults() {
    setForm((current) => ({
      ...defaultForm,
      mode: current.mode,
    }));
  }

  async function fetchDolarRate() {
    setDolarLoading(true);
    setDolarFeedback("");
    setDolarSource(null);

    try {
      const response = await fetch("/api/dolar", {
        method: "GET",
        cache: "no-store",
      });
      const data = (await response.json().catch(() => null)) as
        | DolarApiResponse
        | null;

      if (
        response.ok &&
        data?.success &&
        typeof data.cotacaoUsada === "number" &&
        Number.isFinite(data.cotacaoUsada)
      ) {
        updateField("cotacaoDolar", formatRateInput(data.cotacaoUsada));
        setDolarSource(data.source);
        setDolarFeedback("Cotacao carregada.");
        return;
      }

      setDolarSource(data?.source ?? "MANUAL_REQUIRED");
      setDolarFeedback("Nao foi possivel buscar. Preencha manualmente.");
    } catch {
      setDolarSource("MANUAL_REQUIRED");
      setDolarFeedback("Nao foi possivel buscar. Preencha manualmente.");
    } finally {
      setDolarLoading(false);
    }
  }

  async function saveScenario() {
    if (!calculation.result) {
      return;
    }

    if (!user) {
      const localScenario: CrushMarginHistoryItem = {
        id: createLocalId(),
        createdAt: new Date().toISOString(),
        observacoes: form.observacoes.trim(),
        input: calculation.input,
        result: calculation.result,
      };

      setHistory((current) => {
        const nextHistory = [localScenario, ...current].slice(0, 50);
        writeLocalHistory(nextHistory);
        return nextHistory;
      });
      setFeedback(
        "Cenario salvo no cache deste navegador. Faca login para salvar no banco.",
      );
      return;
    }

    setSaving(true);
    setFeedback("");

    const response = await fetch("/api/crush-historicos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        observacao: form.observacoes.trim(),
        input: calculation.input,
      }),
    });

    const data = await response.json().catch(() => null);
    setSaving(false);

    if (!response.ok) {
      setFeedback(data?.error ?? "Nao foi possivel salvar o cenario.");
      return;
    }

    if (data?.historico) {
      setHistory((current) => [data.historico, ...current].slice(0, 50));
      setFeedback("Cenario salvo no historico da conta.");
    }
  }

  function loadScenario(item: CrushMarginHistoryItem) {
    setForm(formFromInput(normalizeLegacyInput(item.input), item.observacoes));
    setFeedback("Cenario carregado.");
  }

  async function deleteScenario(item: CrushMarginHistoryItem) {
    if (!user) {
      setHistory((current) => {
        const nextHistory = current.filter(
          (historyItem) => historyItem.id !== item.id,
        );
        writeLocalHistory(nextHistory);
        return nextHistory;
      });
      setFeedback("Cenario local excluido.");
      return;
    }

    const response = await fetch(`/api/crush-historicos/${item.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setFeedback("Nao foi possivel excluir o cenario.");
      return;
    }

    setHistory((current) =>
      current.filter((historyItem) => historyItem.id !== item.id),
    );
    setFeedback("Cenario excluido.");
  }

  async function clearHistory() {
    if (history.length === 0) {
      return;
    }

    setClearDialogOpen(false);

    if (!user) {
      writeLocalHistory([]);
      setHistory([]);
      setFeedback("Historico local limpo.");
      return;
    }

    const response = await fetch("/api/crush-historicos", {
      method: "DELETE",
    });

    if (!response.ok) {
      setFeedback("Nao foi possivel limpar o historico.");
      return;
    }

    setHistory([]);
    setFeedback("Historico limpo.");
  }

  const result = calculation.result;
  const activeFields = fieldsByMode[form.mode];
  const cbotMarketFieldNames: NumericField[] = [
    "cotacaoDolar",
    "sojaUsdPorBushel",
    "fareloUsdPorShortTon",
    "oleoCentsPorLibra",
  ];
  const cbotExternalQuoteFieldNames: NumericField[] = [
    "sojaUsdPorBushel",
    "fareloUsdPorShortTon",
    "oleoCentsPorLibra",
  ];
  const marketFields =
    form.mode === "CBOT"
      ? activeFields.filter((field) =>
          cbotMarketFieldNames.includes(field.name),
        )
      : activeFields;
  const operationalFields =
    form.mode === "CBOT"
      ? activeFields.filter(
          (field) => !cbotMarketFieldNames.includes(field.name),
        )
      : [];

  return (
    <section
      id="calculadora"
      className="scroll-mt-16 bg-[var(--background)] py-8 text-[var(--text-primary)] md:scroll-mt-20 md:py-16"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between md:mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand)] md:text-sm">
              Calculadora
            </p>
            <h2 className="mt-1.5 text-2xl font-semibold leading-tight tracking-tight md:mt-2 md:text-4xl">
              Simule a margem por saca de 60 kg
            </h2>
          </div>
          <p className="max-w-2xl text-xs leading-5 text-[var(--text-secondary)] md:text-sm md:leading-6">
            Interface densa, responsiva e orientada a decisao para soja, farelo,
            oleo, dolar e CBOT.
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="gm-panel rounded-lg p-4 sm:p-6">
            <div className="flex flex-col gap-3 border-b border-[var(--border-soft)] pb-4 sm:flex-row sm:items-start sm:justify-between md:gap-4 md:pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  Modo de entrada
                </p>
                <p className="mt-1.5 text-xs leading-5 text-[var(--text-secondary)] md:mt-2 md:text-sm md:leading-6">
                  {getModeDescription(form.mode)}
                </p>
              </div>
              <Button onClick={resetDefaults} variant="subtle">
                Restaurar padrao
              </Button>
            </div>

            <div className="mt-4 grid gap-2 rounded-lg border border-[var(--border-soft)] bg-[var(--background-soft)] p-1.5 sm:grid-cols-2 md:mt-5">
              {modeOptions.map((option) => {
                const isActive = option.mode === form.mode;

                return (
                  <button
                    key={option.mode}
                    type="button"
                    onClick={() => updateMode(option.mode)}
                    className={[
                      "rounded-md border px-3 py-2.5 text-left transition duration-200 md:py-3",
                      isActive
                        ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--text-primary)] shadow-[0_0_0_1px_rgba(61,220,132,0.14)]"
                        : "border-transparent text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]",
                    ].join(" ")}
                  >
                    <span className="block text-sm font-semibold">
                      {option.label}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-xs text-[var(--text-muted)]">
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>

            <form className="mt-4 grid gap-4 sm:grid-cols-2 md:mt-6 md:gap-5">
              {marketFields.map((field) => (
                <InputField
                  key={field.name}
                  id={field.name}
                  label={field.label}
                  value={form[field.name]}
                  onChange={(value) => updateField(field.name, value)}
                  error={calculation.errors[field.name]}
                  helper={
                    field.name === "cotacaoDolar"
                      ? getDolarFieldHelper(
                          field.helper,
                          dolarFeedback,
                          dolarSource,
                        )
                      : field.helper
                  }
                  prefix={field.prefix}
                  suffix={field.suffix}
                  action={
                    field.name === "cotacaoDolar" ? (
                      <button
                        type="button"
                        onClick={fetchDolarRate}
                        disabled={dolarLoading}
                        className="rounded-md border border-[var(--border-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--brand-dark)] hover:bg-[var(--brand-soft)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {dolarLoading ? "Carregando..." : "Carregar cotacao"}
                      </button>
                    ) : form.mode === "CBOT" &&
                      cbotExternalQuoteFieldNames.includes(field.name) ? (
                      <a
                        href="#consultar-cotacoes-externas"
                        className="rounded-md border border-[var(--border-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--brand-dark)] hover:bg-[var(--brand-soft)] hover:text-[var(--text-primary)]"
                      >
                        Buscar cotacao
                      </a>
                    ) : null
                  }
                />
              ))}

              {operationalFields.map((field) => (
                <InputField
                  key={field.name}
                  id={field.name}
                  label={field.label}
                  value={form[field.name]}
                  onChange={(value) => updateField(field.name, value)}
                  error={calculation.errors[field.name]}
                  helper={field.helper}
                  prefix={field.prefix}
                  suffix={field.suffix}
                />
              ))}

              {form.mode === "CBOT" ? (
                <ExternalMarketLinks className="sm:col-span-2" />
              ) : null}

              <div className="sm:col-span-2">
                <label
                  htmlFor="observacoes"
                  className="block text-sm font-semibold text-[var(--text-primary)]"
                >
                  Observacoes do cenario
                </label>
                <textarea
                  id="observacoes"
                  value={form.observacoes}
                  onChange={(event) =>
                    updateField("observacoes", event.target.value)
                  }
                  maxLength={255}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-md border border-[var(--border-soft)] bg-[var(--background-soft)] px-3 py-3 text-base text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand)] focus:bg-[var(--surface)]"
                  placeholder="Ex.: base Paranagua, safra atual, custo industrial estimado."
                />
              </div>
            </form>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-start md:mt-6">
              <div className="space-y-3">
                {authLoaded && !user ? (
                  <div className="rounded-lg border border-[var(--warning)]/30 bg-[#20180c] p-3 text-xs leading-5 text-amber-100 md:p-4 md:text-sm md:leading-6">
                    Sem login, este cenario fica salvo apenas no cache deste
                    navegador. Para salvar no banco e acessar em outros
                    dispositivos, faca login.
                    <div className="mt-3 flex gap-2">
                      <a
                        href="/login"
                        className="rounded-md border border-amber-100/30 px-3 py-2 text-xs font-bold transition hover:bg-amber-200/10"
                      >
                        Login
                      </a>
                      <a
                        href="/cadastro"
                        className="rounded-md bg-[var(--warning)] px-3 py-2 text-xs font-bold text-[#120d05] transition hover:bg-amber-300"
                      >
                        Cadastro
                      </a>
                    </div>
                  </div>
                ) : null}
                {!calculation.isValid ? (
                  <p className="text-sm text-red-300">
                    Corrija os campos destacados para calcular e salvar.
                  </p>
                ) : null}
                <Toast message={feedback} />
              </div>

              {authLoaded ? (
                <Button
                  onClick={saveScenario}
                  disabled={!calculation.isValid || saving}
                  variant="primary"
                  className="w-full lg:w-auto"
                >
                  {saving
                    ? "Salvando..."
                    : user
                      ? "Salvar cenario"
                      : "Salvar no navegador"}
                </Button>
              ) : null}
            </div>
          </div>

          <aside className="space-y-3 md:space-y-4 xl:sticky xl:top-24 xl:self-start">
            {result ? (
              <>
                <div className="gm-panel-elevated rounded-lg p-4 md:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                        Margem liquida
                      </p>
                      <p className="gm-number mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:mt-3 md:text-4xl">
                        {formatCurrencyBRL(result.margemLiquida)}
                      </p>
                    </div>
                    <StatusBadge
                      status={result.status}
                      label={result.statusLabel}
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--border-soft)] pt-3 md:mt-5 md:pt-4">
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">
                        % sobre custo
                      </p>
                      <p className="gm-number mt-1 text-lg font-semibold text-[var(--text-primary)] md:text-xl">
                        {formatPercent(result.margemPercentualSobreCusto)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">
                        Soja maxima
                      </p>
                      <p className="gm-number mt-1 text-lg font-semibold text-[var(--text-primary)] md:text-xl">
                        {formatCurrencyBRL(
                          result.precoMaximoSojaParaMargemZero,
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 xl:grid-cols-1">
                  <ResultCard
                    label="Receita farelo"
                    value={formatCurrencyBRL(result.receitaFarelo)}
                    helper="Preco do farelo em R$/ton x kg por saca / 1000."
                    tone="neutral"
                  />
                  <ResultCard
                    label="Receita oleo"
                    value={formatCurrencyBRL(result.receitaOleo)}
                    helper="Preco do oleo em R$/ton x kg por saca / 1000."
                    tone="neutral"
                  />
                  <ResultCard
                    label="Receita total"
                    value={formatCurrencyBRL(result.receitaTotalDerivados)}
                    tone="positive"
                  />
                  <ResultCard
                    label="Custo total"
                    value={formatCurrencyBRL(result.custoTotal)}
                    helper="Preco da soja + custos operacionais."
                    tone="neutral"
                  />
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-red-400/30 bg-red-400/10 p-5">
                <p className="text-xl font-semibold text-red-50">
                  Resultado indisponivel
                </p>
                <p className="mt-2 text-sm leading-6 text-red-100/80">
                  Informe numeros validos, sem precos negativos, cotacao de
                  dolar maior que zero quando aplicavel e rendimentos acima de
                  zero.
                </p>
              </div>
            )}
          </aside>
        </div>

        {result ? (
          <div className="mt-4 grid gap-4 md:mt-6 md:gap-6 lg:grid-cols-[1fr_360px]">
            <ConversionPreview
              prices={result.convertedPrices}
              showUsd={form.mode !== "BRL"}
            />
            <FormulaExplainer />
          </div>
        ) : null}

        <p className="mt-4 rounded-lg border border-[var(--border-soft)] bg-[var(--background-soft)] px-3 py-2.5 text-xs leading-5 text-[var(--text-muted)] md:mt-5 md:px-4 md:py-3">
          Este sistema realiza simulacoes com base nos valores informados pelo
          usuario. Nao fornecemos, revendemos ou redistribuimos dados de mercado
          de terceiros.
        </p>

        <div className="mt-7 md:mt-10">
          <HistoryTable
            items={history}
            isAuthenticated={Boolean(user)}
            isLoading={historyLoading}
            onClear={() => setClearDialogOpen(true)}
            onDelete={deleteScenario}
            onLoad={loadScenario}
          />
        </div>
      </div>

      <ConfirmDialog
        open={clearDialogOpen}
        title={user ? "Limpar historico da conta?" : "Limpar historico local?"}
        description={
          user
            ? "Esta acao remove todos os cenarios salvos no seu perfil."
            : "Esta acao remove os cenarios salvos apenas neste navegador."
        }
        confirmLabel="Limpar historico"
        onCancel={() => setClearDialogOpen(false)}
        onConfirm={clearHistory}
      />
    </section>
  );
}
