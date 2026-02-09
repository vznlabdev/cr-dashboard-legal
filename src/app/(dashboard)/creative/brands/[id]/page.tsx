"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Pencil,
  Download,
  Palette,
  Type,
  Image as ImageIcon,
  Lightbulb,
  Target,
  Heart,
  Ticket,
  Calendar,
} from "lucide-react"
import { getBrandById, mockTickets } from "@/lib/mock-data/creative"
import { ColorPalette, FontPreview, TicketCard } from "@/components/creative"
import { format } from "date-fns"

export default function BrandDetailPage() {
  const params = useParams()
  const router = useRouter()
  const brandId = params.id as string
  const brand = getBrandById(brandId)

  // Get tickets for this brand
  const brandTickets = mockTickets.filter((t) => t.brandId === brandId)
  const activeTickets = brandTickets.filter((t) => t.status !== "delivered")
  const deliveredTickets = brandTickets.filter((t) => t.status === "delivered")

  if (!brand) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h1 className="text-2xl font-bold">Brand Not Found</h1>
        <p className="text-muted-foreground">
          The brand you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button onClick={() => router.push("/creative/brands")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Brands
        </Button>
      </div>
    )
  }

  const primaryColor = brand.colors.find((c) => c.type === "primary")

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/creative/brands")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-4">
            {/* Brand Logo/Initial */}
            <div
              className="h-16 w-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
              style={{ backgroundColor: primaryColor?.hex || "#666" }}
            >
              {brand.name.charAt(0)}
            </div>
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {brand.name}
              </h1>
              <p className="text-muted-foreground mt-1 max-w-xl">
                {brand.description}
              </p>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Ticket className="h-3 w-3" />
                  {activeTickets.length} active ticket{activeTickets.length !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Updated {format(brand.updatedAt, "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/creative/brands/${brand.id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Brand
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Color Bar */}
      <div className="h-3 rounded-full flex overflow-hidden shadow-sm">
        {brand.colors.map((color) => (
          <div
            key={color.id}
            className="flex-1"
            style={{ backgroundColor: color.hex }}
            title={`${color.name} - ${color.hex}`}
          />
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="tickets">Tickets ({brandTickets.length})</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Brand Identity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Brand Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {brand.mission && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Mission</h4>
                    <p className="text-sm">{brand.mission}</p>
                  </div>
                )}
                {brand.vision && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Vision</h4>
                    <p className="text-sm">{brand.vision}</p>
                  </div>
                )}
                {brand.values.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Values</h4>
                    <div className="flex flex-wrap gap-2">
                      {brand.values.map((value, i) => (
                        <Badge key={i} variant="secondary">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Target Audience & Personality */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Audience & Personality
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Target Audience
                  </h4>
                  <p className="text-sm">{brand.targetAudience}</p>
                </div>
                {brand.personality.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Brand Personality
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {brand.personality.map((trait, i) => (
                        <Badge key={i} variant="outline">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Color Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Color Palette
                </CardTitle>
                <CardDescription>Click a color to copy its hex code</CardDescription>
              </CardHeader>
              <CardContent>
                <ColorPalette colors={brand.colors} size="md" />
              </CardContent>
            </Card>

            {/* Typography Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-primary" />
                  Typography
                </CardTitle>
              </CardHeader>
              <CardContent>
                {brand.fonts.length > 0 ? (
                  <div className="space-y-3">
                    {brand.fonts.map((font) => (
                      <div key={font.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium" style={{ fontFamily: font.name }}>
                            {font.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{font.usage}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {font.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No fonts specified yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Tickets */}
          {activeTickets.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-primary" />
                    Active Tickets
                  </CardTitle>
                  <Link href={`/creative/tickets?brand=${brand.id}`}>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeTickets.slice(0, 3).map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} variant="compact" />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>
                Click any color swatch to copy its hex code to clipboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ColorPalette colors={brand.colors} size="lg" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography">
          <Card>
            <CardHeader>
              <CardTitle>Typography Guidelines</CardTitle>
              <CardDescription>
                Fonts and their usage in brand materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FontPreview fonts={brand.fonts} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          {/* Logos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Logo Assets
              </CardTitle>
              <CardDescription>
                Logo variations and usage guidelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              {brand.logos.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {brand.logos.map((logo) => (
                    <div
                      key={logo.id}
                      className="aspect-square rounded-lg border border-dashed border-border bg-muted/50 flex items-center justify-center p-4"
                    >
                      <span className="text-sm text-muted-foreground">{logo.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground mb-4">No logo assets uploaded yet</p>
                  <Link href={`/creative/brands/${brand.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Upload Logos
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reference Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Reference & Inspiration
              </CardTitle>
            </CardHeader>
            <CardContent>
              {brand.referenceImages.length > 0 || brand.inspirations.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Show reference images and inspirations */}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground mb-4">
                    No reference images or inspirations added yet
                  </p>
                  <Link href={`/creative/brands/${brand.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Add References
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          {/* Active Tickets */}
          {activeTickets.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Active Tickets ({activeTickets.length})
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </div>
          )}

          {/* Delivered Tickets */}
          {deliveredTickets.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Completed Tickets ({deliveredTickets.length})
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {deliveredTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {brandTickets.length === 0 && (
            <div className="text-center py-12">
              <Ticket className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground mb-4">
                No tickets created for this brand yet
              </p>
              <Link href="/creative/tickets/new">
                <Button>
                  Create First Ticket
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

