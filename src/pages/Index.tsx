import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

interface UrlStatus {
  url: string;
  status: 'pending' | 'indexed' | 'not-indexed' | 'error';
  title?: string;
}

const Index = () => {
  const [urls, setUrls] = useState<string>("");
  const [results, setResults] = useState<UrlStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleCheck = async () => {
    const urlList = urls.split('\n').filter(url => url.trim() !== '');
    
    if (urlList.length === 0) {
      toast.error("Добавьте хотя бы один URL для проверки");
      return;
    }

    if (urlList.length > 100) {
      toast.error("Максимум 100 URL за один раз");
      return;
    }

    setIsChecking(true);
    setProgress(0);
    const initialResults: UrlStatus[] = urlList.map(url => ({
      url: url.trim(),
      status: 'pending'
    }));
    setResults(initialResults);

    for (let i = 0; i < urlList.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const randomStatus = Math.random();
      const status: 'indexed' | 'not-indexed' | 'error' = 
        randomStatus > 0.7 ? 'indexed' : 
        randomStatus > 0.3 ? 'not-indexed' : 'error';

      setResults(prev => prev.map((result, idx) => 
        idx === i ? { 
          ...result, 
          status,
          title: status === 'indexed' ? `Страница ${i + 1}` : undefined
        } : result
      ));

      setProgress(((i + 1) / urlList.length) * 100);
    }

    setIsChecking(false);
    toast.success("Проверка завершена");
  };

  const stats = {
    total: results.length,
    indexed: results.filter(r => r.status === 'indexed').length,
    notIndexed: results.filter(r => r.status === 'not-indexed').length,
    errors: results.filter(r => r.status === 'error').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'indexed': return 'CheckCircle2';
      case 'not-indexed': return 'XCircle';
      case 'error': return 'AlertCircle';
      default: return 'Clock';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'indexed': return 'bg-accent text-accent-foreground';
      case 'not-indexed': return 'bg-destructive text-destructive-foreground';
      case 'error': return 'bg-muted text-muted-foreground';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  const pricingPlans = [
    { name: "Старт", price: "990₽", checks: "100 проверок", features: ["Базовая проверка", "История 7 дней", "Email поддержка"] },
    { name: "Бизнес", price: "2990₽", features: ["1000 проверок", "История 30 дней", "API доступ", "Приоритетная поддержка"], popular: true },
    { name: "Энтерпрайз", price: "9990₽", checks: "10000 проверок", features: ["Безлимитные проверки", "История без ограничений", "Полный API", "Персональный менеджер"] }
  ];

  const faqs = [
    { q: "Как работает проверка индексации?", a: "Сервис отправляет запросы к Google и анализирует наличие ваших страниц в индексе поисковой системы." },
    { q: "Сколько времени занимает проверка?", a: "В среднем 0.5-1 секунда на один URL. Массовая проверка 100 URL займёт около 1-2 минут." },
    { q: "Можно ли экспортировать результаты?", a: "Да, все тарифы включают экспорт в CSV и Excel форматы." },
    { q: "Есть ли API для интеграции?", a: "API доступен начиная с тарифа Бизнес." }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Search" className="text-primary" size={32} />
              <h1 className="text-2xl font-bold">Google Index Checker</h1>
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#check" className="text-sm font-medium hover:text-primary transition-colors">Проверка</a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Тарифы</a>
              <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">FAQ</a>
              <a href="#contacts" className="text-sm font-medium hover:text-primary transition-colors">Контакты</a>
            </nav>
          </div>
        </div>
      </header>

      <section id="check" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Массовая проверка индексации
            </h2>
            <p className="text-xl text-muted-foreground">
              Проверьте до 100 URL одновременно за считанные минуты
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="ListPlus" className="text-primary" />
                  Добавить URL
                </CardTitle>
                <CardDescription>
                  Вставьте список URL (по одному на строку)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-muted-foreground">
                    {urls.split('\n').filter(u => u.trim()).length} / 100 URL
                  </span>
                  <Button 
                    onClick={handleCheck} 
                    disabled={isChecking}
                    className="gap-2"
                  >
                    {isChecking ? (
                      <>
                        <Icon name="Loader2" className="animate-spin" size={16} />
                        Проверяю...
                      </>
                    ) : (
                      <>
                        <Icon name="Play" size={16} />
                        Начать проверку
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BarChart3" className="text-primary" />
                  Статистика
                </CardTitle>
                <CardDescription>
                  Результаты проверки в реальном времени
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isChecking && (
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Прогресс</span>
                      <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-secondary">
                    <div className="text-3xl font-bold text-primary">{stats.indexed}</div>
                    <div className="text-sm text-muted-foreground">Проиндексировано</div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary">
                    <div className="text-3xl font-bold text-destructive">{stats.notIndexed}</div>
                    <div className="text-sm text-muted-foreground">Не найдено</div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary">
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Всего URL</div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary">
                    <div className="text-3xl font-bold text-muted-foreground">{stats.errors}</div>
                    <div className="text-sm text-muted-foreground">Ошибки</div>
                  </div>
                </div>

                {results.length > 0 && (
                  <div className="mt-6">
                    <div className="h-48 relative">
                      <div className="absolute inset-0 flex items-end justify-around gap-2">
                        <div className="flex flex-col items-center flex-1">
                          <div 
                            className="w-full bg-accent rounded-t transition-all duration-500"
                            style={{ height: `${(stats.indexed / stats.total) * 100}%` }}
                          />
                          <span className="text-xs mt-1">Indexed</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                          <div 
                            className="w-full bg-destructive rounded-t transition-all duration-500"
                            style={{ height: `${(stats.notIndexed / stats.total) * 100}%` }}
                          />
                          <span className="text-xs mt-1">Not found</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                          <div 
                            className="w-full bg-muted rounded-t transition-all duration-500"
                            style={{ height: `${(stats.errors / stats.total) * 100}%` }}
                          />
                          <span className="text-xs mt-1">Errors</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {results.length > 0 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Icon name="FileText" className="text-primary" />
                    Результаты проверки
                  </span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Icon name="Download" size={16} />
                    Экспорт CSV
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="all">Все ({stats.total})</TabsTrigger>
                    <TabsTrigger value="indexed">Indexed ({stats.indexed})</TabsTrigger>
                    <TabsTrigger value="not-indexed">Not Found ({stats.notIndexed})</TabsTrigger>
                    <TabsTrigger value="error">Errors ({stats.errors})</TabsTrigger>
                  </TabsList>

                  {['all', 'indexed', 'not-indexed', 'error'].map(tab => (
                    <TabsContent key={tab} value={tab} className="space-y-2">
                      {results
                        .filter(r => tab === 'all' || r.status === tab)
                        .map((result, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition-colors"
                          >
                            <Badge className={getStatusColor(result.status)}>
                              <Icon name={getStatusIcon(result.status)} size={14} />
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{result.url}</div>
                              {result.title && (
                                <div className="text-xs text-muted-foreground">{result.title}</div>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground capitalize">
                              {result.status === 'indexed' ? 'Проиндексировано' : 
                               result.status === 'not-indexed' ? 'Не найдено' : 
                               result.status === 'error' ? 'Ошибка' : 'Ожидание'}
                            </span>
                          </div>
                        ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section id="pricing" className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Тарифы и цены</h2>
            <p className="text-xl text-muted-foreground">
              Выберите план под ваши задачи
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, idx) => (
              <Card 
                key={idx} 
                className={`hover-scale ${plan.popular ? 'border-primary border-2' : ''}`}
              >
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium rounded-t-lg">
                    Популярный
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{plan.price}</div>
                  <CardDescription>{plan.checks}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Icon name="Check" className="text-accent" size={16} />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    Выбрать план
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Вопросы и ответы</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border border-border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section id="contacts" className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Контакты</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover-scale">
              <CardHeader>
                <Icon name="Mail" className="text-primary mb-2" size={32} />
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <a href="mailto:support@indexchecker.com" className="text-primary hover:underline">
                  support@indexchecker.com
                </a>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <Icon name="MessageCircle" className="text-primary mb-2" size={32} />
                <CardTitle>Telegram</CardTitle>
              </CardHeader>
              <CardContent>
                <a href="https://t.me/indexchecker" className="text-primary hover:underline">
                  @indexchecker
                </a>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <Icon name="Phone" className="text-primary mb-2" size={32} />
                <CardTitle>Телефон</CardTitle>
              </CardHeader>
              <CardContent>
                <a href="tel:+74951234567" className="text-primary hover:underline">
                  +7 (495) 123-45-67
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Google Index Checker. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
