import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency, calculateSimulation } from "@/lib/simulatorCalc";
import PercentualAdjustmentPanel from "@/components/PercentualAdjustmentPanel";

interface SimulatorState {
  // Campos de entrada
  valorImovel: number;
  prazoParcela: number;
  valorAto: number;
  valorFinanciamento: number;
  valorFgts: number;
  valorVistoria: number;
  qtdPrimeirasMensais: number;
  
  // Faixas de parcelas
  faixa1Qtd: number;
  faixa1Valor: number;
  faixa2Qtd: number;
  faixa2Valor: number;
  faixa3Qtd: number;
  faixa3Valor: number;
  
  // Percentuais dinâmicos
  percentualAto: number;
  percentualPrimeiras: number;
}

interface CalculatedValues {
  sugestaoAto: number;
  sugestaoFinanciamento: number;
  sugestaoFgts: number;
  sugestaoVistoria: number;
  sugestaoParcelado: number;
  sugestaoTotal: number;
  
  saldoMensal: number;
  primeirasMensais: number;
  qtdDemaisMensais: number;
  demaisMensais: number;
  mensaisLineares: number;
  comissaoRepasse: number;
  
  faixa4Qtd: number;
  faixa4Valor: number;
  totalFluxoPersonalizado: number;
  validacaoEntrada: string;
}

const INITIAL_STATE: SimulatorState = {
  valorImovel: 238187,
  prazoParcela: 40,
  valorAto: 0,
  valorFinanciamento: 0,
  valorFgts: 0,
  valorVistoria: 0,
  qtdPrimeirasMensais: 6,
  faixa1Qtd: 10,
  faixa1Valor: 2000,
  faixa2Qtd: 10,
  faixa2Valor: 1800,
  faixa3Qtd: 10,
  faixa3Valor: 1300,
  percentualAto: 5,
  percentualPrimeiras: 3,
};

export default function Simulator() {
  const [state, setState] = useState<SimulatorState>(INITIAL_STATE);
  const [calculated, setCalculated] = useState<CalculatedValues>({} as CalculatedValues);

  useEffect(() => {
    const result = calculateSimulation(state);
    setCalculated(result);
  }, [state]);

  const handleInputChange = (field: keyof SimulatorState, value: string) => {
    const numValue = parseFloat(value) || 0;
    setState((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const handlePercentualAtoChange = (value: number) => {
    const valorCalculado = (state.valorImovel * value) / 100;
    setState((prev) => ({
      ...prev,
      percentualAto: value,
      valorAto: valorCalculado,
    }));
  };

  const handlePercentualPrimeirasChange = (value: number) => {
    setState((prev) => ({
      ...prev,
      percentualPrimeiras: value,
    }));
  };

  const isValidEntrada = calculated.validacaoEntrada === "OK ENTRADA";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Simulador Corretor Elite 4.0</h1>
              <p className="text-slate-400">Fechamento de Mesa | Negociação Avançada de Parcelas</p>
            </div>
          </div>
        </div>

        {/* Validation Alert */}
        {!isValidEntrada && (
          <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-950">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              ⚠️ Entrada insuficiente. O Ato + {state.qtdPrimeirasMensais} primeiras parcelas devem atingir no mínimo 8% do valor do imóvel.
            </AlertDescription>
          </Alert>
        )}

        {isValidEntrada && (
          <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950 border-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200 font-bold text-lg">
              ✓ ENTRADA SUFICIENTE - APROVADO
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="percentuais" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="percentuais">Ajuste de Percentuais</TabsTrigger>
            <TabsTrigger value="entrada">Sugestão de Entrada</TabsTrigger>
            <TabsTrigger value="fluxo">Fluxo Personalizado</TabsTrigger>
            <TabsTrigger value="resumo">Resumo Executivo</TabsTrigger>
          </TabsList>

          {/* TAB 0: AJUSTE DE PERCENTUAIS */}
          <TabsContent value="percentuais" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dados Básicos */}
              <Card className="bg-slate-800 border-slate-700 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-white">Dados Básicos</CardTitle>
                  <CardDescription>Informações do imóvel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Valor do Imóvel (R$)</Label>
                    <Input
                      type="number"
                      value={state.valorImovel}
                      onChange={(e) => handleInputChange("valorImovel", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Prazo (meses)</Label>
                    <Input
                      type="number"
                      value={state.prazoParcela}
                      onChange={(e) => handleInputChange("prazoParcela", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Qtd. Primeiras Mensais</Label>
                    <Input
                      type="number"
                      value={state.qtdPrimeirasMensais}
                      onChange={(e) => handleInputChange("qtdPrimeirasMensais", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Painel de Percentuais */}
              <div className="lg:col-span-2">
                <PercentualAdjustmentPanel
                  valorImovel={state.valorImovel}
                  percentualAto={state.percentualAto}
                  percentualPrimeiras={state.percentualPrimeiras}
                  onAtoChange={handlePercentualAtoChange}
                  onPrimeirasChange={handlePercentualPrimeirasChange}
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB 1: SUGESTÃO DE ENTRADA */}
          <TabsContent value="entrada" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dados Básicos */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Dados Básicos do Imóvel</CardTitle>
                  <CardDescription>Informações principais da negociação</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Valor do Imóvel (R$)</Label>
                    <Input
                      type="number"
                      value={state.valorImovel}
                      onChange={(e) => handleInputChange("valorImovel", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Prazo de Parcelamento (meses)</Label>
                    <Input
                      type="number"
                      value={state.prazoParcela}
                      onChange={(e) => handleInputChange("prazoParcela", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sugestão de Pagamento */}
              <Card className="bg-gradient-to-br from-amber-900 to-amber-950 border-amber-700">
                <CardHeader>
                  <CardTitle className="text-amber-100">Sugestão de Pagamento</CardTitle>
                  <CardDescription className="text-amber-200">Estrutura recomendada ({state.percentualAto.toFixed(1)}% ATO + 70% FIN + 1% VIST)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-amber-800 rounded-lg">
                    <span className="text-amber-100">Ato ({state.percentualAto.toFixed(1)}%)</span>
                    <span className="text-lg font-bold text-amber-300">{formatCurrency(calculated.sugestaoAto || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-800 rounded-lg">
                    <span className="text-amber-100">Financiamento (70%)</span>
                    <span className="text-lg font-bold text-amber-300">{formatCurrency(calculated.sugestaoFinanciamento || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-800 rounded-lg">
                    <span className="text-amber-100">Vistoria (1%)</span>
                    <span className="text-lg font-bold text-amber-300">{formatCurrency(calculated.sugestaoVistoria || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-700 rounded-lg border border-amber-600">
                    <span className="text-amber-100">Parcelado em {state.prazoParcela}x</span>
                    <span className="text-lg font-bold text-amber-200">{formatCurrency(calculated.sugestaoParcelado || 0)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Entrada Editável */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Entrada Editável</CardTitle>
                <CardDescription>Customize os valores da entrada conforme negociação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-slate-300">Ato (R$)</Label>
                    <Input
                      type="number"
                      value={state.valorAto}
                      onChange={(e) => handleInputChange("valorAto", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Financiamento (R$)</Label>
                    <Input
                      type="number"
                      value={state.valorFinanciamento}
                      onChange={(e) => handleInputChange("valorFinanciamento", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">FGTS (R$)</Label>
                    <Input
                      type="number"
                      value={state.valorFgts}
                      onChange={(e) => handleInputChange("valorFgts", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Vistoria (R$)</Label>
                    <Input
                      type="number"
                      value={state.valorVistoria}
                      onChange={(e) => handleInputChange("valorVistoria", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo da Entrada */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Resumo da Entrada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-slate-700 rounded">
                    <span className="text-slate-300">Total da Entrada</span>
                    <span className="text-white font-bold">{formatCurrency(state.valorAto + state.valorFinanciamento + state.valorVistoria)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-700 rounded">
                    <span className="text-slate-300">Percentual do Imóvel</span>
                    <span className="text-white font-bold">
                      {((state.valorAto + state.valorFinanciamento + state.valorVistoria) / state.valorImovel * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-700 rounded">
                    <span className="text-slate-300">Saldo a Parcelar</span>
                    <span className="text-white font-bold">{formatCurrency(calculated.saldoMensal || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: FLUXO PERSONALIZADO */}
          <TabsContent value="fluxo" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Primeiras Parcelas</CardTitle>
                <CardDescription>Defina a quantidade e valor das primeiras parcelas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-slate-300">Quantidade de Primeiras Mensais</Label>
                    <Input
                      type="number"
                      value={state.qtdPrimeirasMensais}
                      onChange={(e) => handleInputChange("qtdPrimeirasMensais", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Valor Calculado</Label>
                    <div className="mt-2 p-3 bg-slate-700 rounded text-white font-bold">
                      {formatCurrency(calculated.primeirasMensais || 0)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-300">Total (Ato + Primeiras)</Label>
                    <div className="mt-2 p-3 bg-amber-700 rounded text-amber-100 font-bold">
                      {formatCurrency(state.valorAto + (state.qtdPrimeirasMensais * (calculated.primeirasMensais || 0)))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Faixas de Parcelas */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Faixas de Parcelas Mensais</CardTitle>
                <CardDescription>Customize o fluxo de pagamento em até 4 faixas diferentes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Faixa 1 */}
                <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <h4 className="text-white font-semibold mb-3">Faixa 1</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Quantidade de Meses</Label>
                      <Input
                        type="number"
                        value={state.faixa1Qtd}
                        onChange={(e) => handleInputChange("faixa1Qtd", e.target.value)}
                        className="bg-slate-600 border-slate-500 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Valor da Parcela (R$)</Label>
                      <Input
                        type="number"
                        value={state.faixa1Valor}
                        onChange={(e) => handleInputChange("faixa1Valor", e.target.value)}
                        className="bg-slate-600 border-slate-500 text-white mt-2"
                      />
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-slate-600 rounded text-slate-200 text-sm">
                    Total: {formatCurrency(state.faixa1Qtd * state.faixa1Valor)}
                  </div>
                </div>

                {/* Faixa 2 */}
                <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <h4 className="text-white font-semibold mb-3">Faixa 2</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Quantidade de Meses</Label>
                      <Input
                        type="number"
                        value={state.faixa2Qtd}
                        onChange={(e) => handleInputChange("faixa2Qtd", e.target.value)}
                        className="bg-slate-600 border-slate-500 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Valor da Parcela (R$)</Label>
                      <Input
                        type="number"
                        value={state.faixa2Valor}
                        onChange={(e) => handleInputChange("faixa2Valor", e.target.value)}
                        className="bg-slate-600 border-slate-500 text-white mt-2"
                      />
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-slate-600 rounded text-slate-200 text-sm">
                    Total: {formatCurrency(state.faixa2Qtd * state.faixa2Valor)}
                  </div>
                </div>

                {/* Faixa 3 */}
                <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <h4 className="text-white font-semibold mb-3">Faixa 3</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Quantidade de Meses</Label>
                      <Input
                        type="number"
                        value={state.faixa3Qtd}
                        onChange={(e) => handleInputChange("faixa3Qtd", e.target.value)}
                        className="bg-slate-600 border-slate-500 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Valor da Parcela (R$)</Label>
                      <Input
                        type="number"
                        value={state.faixa3Valor}
                        onChange={(e) => handleInputChange("faixa3Valor", e.target.value)}
                        className="bg-slate-600 border-slate-500 text-white mt-2"
                      />
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-slate-600 rounded text-slate-200 text-sm">
                    Total: {formatCurrency(state.faixa3Qtd * state.faixa3Valor)}
                  </div>
                </div>

                {/* Faixa 4 (Calculada) */}
                <div className="p-4 bg-gradient-to-br from-green-900 to-green-950 rounded-lg border border-green-700">
                  <h4 className="text-green-100 font-semibold mb-3">Faixa 4 (Calculada Automaticamente)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-green-200">Quantidade de Meses</Label>
                      <div className="mt-2 p-3 bg-green-800 rounded text-green-100 font-bold">
                        {calculated.faixa4Qtd || 0}
                      </div>
                    </div>
                    <div>
                      <Label className="text-green-200">Valor da Parcela (R$)</Label>
                      <div className="mt-2 p-3 bg-green-800 rounded text-green-100 font-bold">
                        {formatCurrency(calculated.faixa4Valor || 0)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-green-800 rounded text-green-200 text-sm">
                    Total: {formatCurrency((calculated.faixa4Qtd || 0) * (calculated.faixa4Valor || 0))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total do Fluxo */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Total do Fluxo Personalizado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Ato</span>
                    <span className="text-white font-bold">{formatCurrency(state.valorAto)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Financiamento</span>
                    <span className="text-white font-bold">{formatCurrency(state.valorFinanciamento)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">FGTS</span>
                    <span className="text-white font-bold">{formatCurrency(state.valorFgts)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Vistoria</span>
                    <span className="text-white font-bold">{formatCurrency(state.valorVistoria)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Parcelas (Faixa 1-4)</span>
                    <span className="text-white font-bold">
                      {formatCurrency(
                        (state.faixa1Qtd * state.faixa1Valor) +
                        (state.faixa2Qtd * state.faixa2Valor) +
                        (state.faixa3Qtd * state.faixa3Valor) +
                        ((calculated.faixa4Qtd || 0) * (calculated.faixa4Valor || 0))
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-amber-700 rounded-lg border border-amber-600 text-lg">
                    <span className="text-amber-100 font-semibold">TOTAL GERAL</span>
                    <span className="text-amber-200 font-bold">{formatCurrency(calculated.totalFluxoPersonalizado || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: RESUMO EXECUTIVO */}
          <TabsContent value="resumo" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Indicadores Principais */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Indicadores Principais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <p className="text-slate-400 text-sm">Valor do Imóvel</p>
                    <p className="text-white text-xl font-bold">{formatCurrency(state.valorImovel)}</p>
                  </div>
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <p className="text-slate-400 text-sm">Prazo Total</p>
                    <p className="text-white text-xl font-bold">{state.prazoParcela} meses</p>
                  </div>
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <p className="text-slate-400 text-sm">Saldo a Parcelar</p>
                    <p className="text-white text-xl font-bold">{formatCurrency(calculated.saldoMensal || 0)}</p>
                  </div>
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <p className="text-slate-400 text-sm">Comissão de Repasse (3%)</p>
                    <p className="text-white text-xl font-bold">{formatCurrency(calculated.comissaoRepasse || 0)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Análise de Parcelas */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Análise de Parcelas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <p className="text-slate-400 text-sm">Primeiras Mensais (Valor)</p>
                    <p className="text-white text-xl font-bold">{formatCurrency(calculated.primeirasMensais || 0)}</p>
                  </div>
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <p className="text-slate-400 text-sm">Demais Mensais (Valor)</p>
                    <p className="text-white text-xl font-bold">{formatCurrency(calculated.demaisMensais || 0)}</p>
                  </div>
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <p className="text-slate-400 text-sm">Mensais Lineares (Sugestão)</p>
                    <p className="text-white text-xl font-bold">{formatCurrency(calculated.mensaisLineares || 0)}</p>
                  </div>
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <p className="text-slate-400 text-sm">Meses Restantes (Faixa 4)</p>
                    <p className="text-white text-xl font-bold">{calculated.faixa4Qtd || 0}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Validação Final */}
            <Card className={`border-2 ${isValidEntrada ? "bg-green-950 border-green-700" : "bg-red-950 border-red-700"}`}>
              <CardHeader>
                <CardTitle className={isValidEntrada ? "text-green-100" : "text-red-100"}>
                  {isValidEntrada ? "✓ Negociação Validada" : "✗ Negociação Inválida"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className={`p-3 rounded-lg ${isValidEntrada ? "bg-green-900 text-green-100" : "bg-red-900 text-red-100"}`}>
                    <p className="font-semibold">Status da Entrada</p>
                    <p className="text-sm mt-1">{calculated.validacaoEntrada}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isValidEntrada ? "bg-green-900 text-green-100" : "bg-red-900 text-red-100"}`}>
                    <p className="font-semibold">Entrada + {state.qtdPrimeirasMensais} Primeiras Parcelas</p>
                    <p className="text-sm mt-1">
                      {formatCurrency(state.valorAto + (state.qtdPrimeirasMensais * (calculated.primeirasMensais || 0)))} ({((state.valorAto + (state.qtdPrimeirasMensais * (calculated.primeirasMensais || 0))) / state.valorImovel * 100).toFixed(2)}% do imóvel)
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${isValidEntrada ? "bg-green-900 text-green-100" : "bg-red-900 text-red-100"}`}>
                    <p className="font-semibold">Mínimo Exigido (8%)</p>
                    <p className="text-sm mt-1">{formatCurrency(state.valorImovel * 0.08)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="flex gap-4">
              <Button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                Exportar Simulação
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => setState(INITIAL_STATE)}
              >
                Resetar Valores
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
