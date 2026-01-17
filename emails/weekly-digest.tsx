import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Img,
  Link,
  Hr,
} from "@react-email/components"

interface ProcessedItem {
  sku: string
  name: string
  brand: string | null
  imageUrl: string | null
  homeDepotUrl: string | null
  retailPrice: string | null
  locations: Record<string, number> // State -> count mapping
}

interface WeeklyDigestProps {
  items: ProcessedItem[]
  stats: {
    itemCount: number
    reportCount: number
    mostActiveState: string
  }
  unsubscribeUrl: string
  weekStartDate: Date
}

export default function WeeklyDigest({
  items,
  stats,
  unsubscribeUrl,
  weekStartDate,
}: WeeklyDigestProps) {
  const formatDateRange = (startDate: Date) => {
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 7)

    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
    const start = startDate.toLocaleDateString("en-US", options)
    const end = endDate.toLocaleDateString("en-US", options)

    return `${start} - ${end}, ${endDate.getFullYear()}`
  }

  const formatLocations = (locations: Record<string, number>, limit = 5) => {
    const entries = Object.entries(locations)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)

    if (entries.length === 0) return "No location data"

    const formatted = entries.map(([state, count]) => `${state} (${count})`).join(", ")

    const remaining = Object.keys(locations).length - entries.length
    if (remaining > 0) {
      return `${formatted} +${remaining} more`
    }

    return formatted
  }

  return (
    <Html>
      <Head>
        <style>
          {`
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.5;
              color: #111827;
            }
            @media only screen and (max-width: 600px) {
              .container {
                padding: 16px !important;
              }
              .product-card {
                padding: 16px !important;
              }
            }
          `}
        </style>
      </Head>
      <Body
        style={{
          backgroundColor: "#f9fafb",
          padding: "20px",
        }}
      >
        <Container
          className="container"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Section
            style={{
              backgroundColor: "#15803d",
              padding: "32px 24px",
              textAlign: "center",
            }}
          >
            <Heading
              style={{
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: "bold",
                margin: "0 0 8px 0",
              }}
            >
              Weekly Penny List
            </Heading>
            <Text
              style={{
                color: "#d1fae5",
                fontSize: "16px",
                margin: "0",
              }}
            >
              Week of {formatDateRange(weekStartDate)}
            </Text>
          </Section>

          {/* Summary Stats */}
          <Section
            style={{
              backgroundColor: "#f3f4f6",
              padding: "24px",
              margin: "0",
            }}
          >
            <Text
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827",
                margin: "0 0 12px 0",
              }}
            >
              📊 This Week&apos;s Summary
            </Text>
            <Text
              style={{
                fontSize: "14px",
                color: "#4b5563",
                margin: "4px 0",
              }}
            >
              • {stats.itemCount} new items reported
            </Text>
            <Text
              style={{
                fontSize: "14px",
                color: "#4b5563",
                margin: "4px 0",
              }}
            >
              • {stats.reportCount} reports across multiple states
            </Text>
            <Text
              style={{
                fontSize: "14px",
                color: "#4b5563",
                margin: "4px 0",
              }}
            >
              • Most active: {stats.mostActiveState}
            </Text>
          </Section>

          {/* Product Cards */}
          <Section style={{ padding: "24px" }}>
            {items.length === 0 ? (
              <Section
                style={{
                  padding: "32px",
                  textAlign: "center",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                }}
              >
                <Text
                  style={{
                    fontSize: "18px",
                    color: "#6b7280",
                    margin: "0 0 8px 0",
                  }}
                >
                  🌙 Quiet Week
                </Text>
                <Text
                  style={{
                    fontSize: "14px",
                    color: "#9ca3af",
                    margin: "0",
                  }}
                >
                  No new penny items reported this week. Check back next Sunday!
                </Text>
              </Section>
            ) : (
              items.map((item, index) => (
                <Section
                  key={item.sku}
                  className="product-card"
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "20px",
                    marginBottom: index < items.length - 1 ? "16px" : "0",
                  }}
                >
                  {/* Product Image */}
                  {item.imageUrl && (
                    <Img
                      src={item.imageUrl}
                      alt={item.name}
                      width="200"
                      height="200"
                      style={{
                        display: "block",
                        margin: "0 auto 16px auto",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  {/* Brand */}
                  {item.brand && (
                    <Text
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {item.brand}
                    </Text>
                  )}

                  {/* Product Name */}
                  <Heading
                    as="h3"
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#111827",
                      margin: "0 0 12px 0",
                    }}
                  >
                    {item.name}
                  </Heading>

                  {/* SKU */}
                  <Text
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      margin: "0 0 8px 0",
                    }}
                  >
                    SKU: {item.sku}
                  </Text>

                  {/* Price */}
                  {item.retailPrice && (
                    <Text
                      style={{
                        fontSize: "16px",
                        color: "#111827",
                        margin: "0 0 8px 0",
                      }}
                    >
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "#9ca3af",
                        }}
                      >
                        Was ${item.retailPrice}
                      </span>{" "}
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#15803d",
                        }}
                      >
                        → Now $0.01
                      </span>
                    </Text>
                  )}

                  {/* Locations */}
                  <Text
                    style={{
                      fontSize: "14px",
                      color: "#4b5563",
                      margin: "0 0 16px 0",
                    }}
                  >
                    📍 {formatLocations(item.locations)}
                  </Text>

                  {/* Buttons */}
                  <table
                    width="100%"
                    cellPadding="0"
                    cellSpacing="0"
                    style={{ marginTop: "8px" }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ paddingRight: "8px" }}>
                          {item.homeDepotUrl && (
                            <Button
                              href={item.homeDepotUrl}
                              style={{
                                backgroundColor: "#15803d",
                                color: "#ffffff",
                                padding: "12px 24px",
                                borderRadius: "6px",
                                textDecoration: "none",
                                fontWeight: "600",
                                fontSize: "14px",
                                display: "inline-block",
                              }}
                            >
                              View on Home Depot
                            </Button>
                          )}
                        </td>
                        <td style={{ paddingLeft: "8px", textAlign: "right" }}>
                          <Link
                            href={`https://www.pennycentral.com/sku/${item.sku}`}
                            style={{
                              color: "#15803d",
                              textDecoration: "none",
                              fontSize: "14px",
                              fontWeight: "600",
                            }}
                          >
                            Details →
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Section>
              ))
            )}
          </Section>

          {/* CTA to View Full List */}
          <Section
            style={{
              textAlign: "center",
              padding: "24px",
              backgroundColor: "#f9fafb",
            }}
          >
            <Button
              href="https://www.pennycentral.com/penny-list"
              style={{
                backgroundColor: "#15803d",
                color: "#ffffff",
                padding: "14px 32px",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "16px",
                display: "inline-block",
              }}
            >
              View Full Penny List
            </Button>
          </Section>

          {/* Footer */}
          <Hr style={{ margin: "0", borderColor: "#e5e7eb" }} />
          <Section
            style={{
              padding: "24px",
              textAlign: "center",
            }}
          >
            <Link
              href={unsubscribeUrl}
              style={{
                color: "#6b7280",
                fontSize: "14px",
                textDecoration: "underline",
              }}
            >
              Unsubscribe
            </Link>
            <Text
              style={{
                color: "#9ca3af",
                fontSize: "12px",
                margin: "16px 0 8px 0",
              }}
            >
              © 2026 Penny Central
            </Text>
            <Text
              style={{
                color: "#9ca3af",
                fontSize: "12px",
                margin: "0",
              }}
            >
              Finding savings, one penny at a time
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
