"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function ColorsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1d7b86] to-[#426b70] p-8">
      <div className="container mx-auto space-y-8">
        <div className="text-center">
          <h1 className="nanum-pen-script-regular text-6xl text-[#fcf45a] mb-4">
            Mise Color System
          </h1>
          <p className="text-white text-lg">
            Complete color palette and semantic color system
          </p>
        </div>

        {/* Simple Color Test */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-[#fcf45a]">Simple Color Test</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-[#428a93] border-[#fcf45a]">
              <CardHeader>
                <CardTitle className="text-[#fcf45a]">Primary Ocean</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-16 bg-[#1d7b86] rounded-lg border-2 border-white"></div>
                  <p className="text-white text-sm">#1d7b86</p>
                  <p className="text-white/80 text-xs">Main brand color</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#428a93] border-[#fcf45a]">
              <CardHeader>
                <CardTitle className="text-[#fcf45a]">Secondary Ocean</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-16 bg-[#426b70] rounded-lg border-2 border-white"></div>
                  <p className="text-white text-sm">#426b70</p>
                  <p className="text-white/80 text-xs">Secondary brand color</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#428a93] border-[#fcf45a]">
              <CardHeader>
                <CardTitle className="text-[#fcf45a]">Accent Yellow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-16 bg-[#fcf45a] rounded-lg border-2 border-white"></div>
                  <p className="text-white text-sm">#fcf45a</p>
                  <p className="text-white/80 text-xs">Warm yellow accent</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#428a93] border-[#fcf45a]">
              <CardHeader>
                <CardTitle className="text-[#fcf45a]">Surface Color</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-16 bg-[#428a93] rounded-lg border-2 border-white"></div>
                  <p className="text-white text-sm">#428a93</p>
                  <p className="text-white/80 text-xs">Card and component backgrounds</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Semantic Color Test */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-[#fcf45a]">Semantic Color Test</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-brand-primary border-brand-accent">
              <CardHeader>
                <CardTitle className="text-brand-accent">Brand Primary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-16 bg-brand-primary rounded-lg border-2 border-white"></div>
                  <p className="text-white text-sm">brand-primary</p>
                  <p className="text-white/80 text-xs">Semantic primary</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-secondary border-brand-accent">
              <CardHeader>
                <CardTitle className="text-brand-accent">Brand Secondary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-16 bg-brand-secondary rounded-lg border-2 border-white"></div>
                  <p className="text-white text-sm">brand-secondary</p>
                  <p className="text-white/80 text-xs">Semantic secondary</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-accent border-brand-primary">
              <CardHeader>
                <CardTitle className="text-brand-primary">Brand Accent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-16 bg-brand-accent rounded-lg border-2 border-white"></div>
                  <p className="text-brand-primary text-sm">brand-accent</p>
                  <p className="text-brand-primary/80 text-xs">Semantic accent</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-surface border-brand-accent">
              <CardHeader>
                <CardTitle className="text-brand-accent">Brand Surface</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-16 bg-brand-surface rounded-lg border-2 border-white"></div>
                  <p className="text-white text-sm">brand-surface</p>
                  <p className="text-white/80 text-xs">Semantic surface</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Mise Color Scale Test */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-[#fcf45a]">Mise Ocean Scale Test</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-mise-ocean-50 rounded-lg border-2 border-white"></div>
              <p className="text-white text-xs text-center">50</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-mise-ocean-100 rounded-lg border-2 border-white"></div>
              <p className="text-white text-xs text-center">100</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-mise-ocean-200 rounded-lg border-2 border-white"></div>
              <p className="text-white text-xs text-center">200</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-mise-ocean-300 rounded-lg border-2 border-white"></div>
              <p className="text-white text-xs text-center">300</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-mise-ocean-400 rounded-lg border-2 border-white"></div>
              <p className="text-white text-xs text-center">400</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-mise-ocean-500 rounded-lg border-2 border-white"></div>
              <p className="text-white text-xs text-center">500</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-mise-ocean-600 rounded-lg border-2 border-white"></div>
              <p className="text-white text-xs text-center">600</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-mise-ocean-700 rounded-lg border-2 border-white"></div>
              <p className="text-white text-xs text-center">700</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-mise-ocean-800 rounded-lg border-2 border-white"></div>
              <p className="text-white text-xs text-center">800</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-mise-ocean-900 rounded-lg border-2 border-white"></div>
              <p className="text-white text-xs text-center">900</p>
            </div>
          </div>
        </section>

        {/* Status Colors Test */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-[#fcf45a]">Status Colors Test</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-status-success-light border-status-success-main">
              <CardHeader>
                <CardTitle className="text-status-success-dark">Success</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-12 bg-status-success-light rounded-lg border-2 border-status-success-main"></div>
                  <div className="h-12 bg-status-success-main rounded-lg border-2 border-white"></div>
                  <div className="h-12 bg-status-success-dark rounded-lg border-2 border-white"></div>
                  <p className="text-status-success-dark text-sm">Success states</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-status-error-light border-status-error-main">
              <CardHeader>
                <CardTitle className="text-status-error-dark">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-12 bg-status-error-light rounded-lg border-2 border-status-error-main"></div>
                  <div className="h-12 bg-status-error-main rounded-lg border-2 border-white"></div>
                  <div className="h-12 bg-status-error-dark rounded-lg border-2 border-white"></div>
                  <p className="text-status-error-dark text-sm">Error states</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-status-warning-light border-status-warning-main">
              <CardHeader>
                <CardTitle className="text-status-warning-dark">Warning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-12 bg-status-warning-light rounded-lg border-2 border-status-warning-main"></div>
                  <div className="h-12 bg-status-warning-main rounded-lg border-2 border-white"></div>
                  <div className="h-12 bg-status-warning-dark rounded-lg border-2 border-white"></div>
                  <p className="text-status-warning-dark text-sm">Warning states</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-status-info-light border-status-info-main">
              <CardHeader>
                <CardTitle className="text-status-info-dark">Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-12 bg-status-info-light rounded-lg border-2 border-status-info-main"></div>
                  <div className="h-12 bg-status-info-main rounded-lg border-2 border-white"></div>
                  <div className="h-12 bg-status-info-dark rounded-lg border-2 border-white"></div>
                  <p className="text-status-info-dark text-sm">Info states</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Debug Info */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-[#fcf45a]">Debug Information</h2>
          
          <Card className="bg-[#428a93] border-[#fcf45a]">
            <CardHeader>
              <CardTitle className="text-[#fcf45a]">Color Classes Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-white">
                <div>
                  <h4 className="font-semibold text-[#fcf45a]">Direct Hex Values:</h4>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    <div className="h-8 bg-[#1d7b86] rounded border"></div>
                    <div className="h-8 bg-[#426b70] rounded border"></div>
                    <div className="h-8 bg-[#fcf45a] rounded border"></div>
                    <div className="h-8 bg-[#428a93] rounded border"></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-[#fcf45a]">Semantic Classes:</h4>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    <div className="h-8 bg-brand-primary rounded border"></div>
                    <div className="h-8 bg-brand-secondary rounded border"></div>
                    <div className="h-8 bg-brand-accent rounded border"></div>
                    <div className="h-8 bg-brand-surface rounded border"></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-[#fcf45a]">Mise Scale Classes:</h4>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    <div className="h-8 bg-mise-ocean-500 rounded border"></div>
                    <div className="h-8 bg-mise-ocean-400 rounded border"></div>
                    <div className="h-8 bg-mise-ocean-600 rounded border"></div>
                    <div className="h-8 bg-mise-yellow-500 rounded border"></div>
                    <div className="h-8 bg-mise-yellow-400 rounded border"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}