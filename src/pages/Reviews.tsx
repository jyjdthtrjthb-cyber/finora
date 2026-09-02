import React from 'react'
import { useTranslation } from 'react-i18next'

type ReviewItem = {
  nameKey: string
  statusKey: string
  textKey: string
  benefitKey: string
  rating: number
}

const reviewList: ReviewItem[] = [
  { nameKey: 'review_01_name', statusKey: 'review_01_status', textKey: 'review_01_text', benefitKey: 'review_01_benefit', rating: 5 },
  { nameKey: 'review_02_name', statusKey: 'review_02_status', textKey: 'review_02_text', benefitKey: 'review_02_benefit', rating: 5 },
  { nameKey: 'review_03_name', statusKey: 'review_03_status', textKey: 'review_03_text', benefitKey: 'review_03_benefit', rating: 5 },
  { nameKey: 'review_04_name', statusKey: 'review_04_status', textKey: 'review_04_text', benefitKey: 'review_04_benefit', rating: 5 },
  { nameKey: 'review_05_name', statusKey: 'review_05_status', textKey: 'review_05_text', benefitKey: 'review_05_benefit', rating: 5 },
  { nameKey: 'review_06_name', statusKey: 'review_06_status', textKey: 'review_06_text', benefitKey: 'review_06_benefit', rating: 5 },
  { nameKey: 'review_07_name', statusKey: 'review_07_status', textKey: 'review_07_text', benefitKey: 'review_07_benefit', rating: 5 },
  { nameKey: 'review_08_name', statusKey: 'review_08_status', textKey: 'review_08_text', benefitKey: 'review_08_benefit', rating: 5 },
  { nameKey: 'review_09_name', statusKey: 'review_09_status', textKey: 'review_09_text', benefitKey: 'review_09_benefit', rating: 5 },
  { nameKey: 'review_10_name', statusKey: 'review_10_status', textKey: 'review_10_text', benefitKey: 'review_10_benefit', rating: 5 },
  { nameKey: 'review_11_name', statusKey: 'review_11_status', textKey: 'review_11_text', benefitKey: 'review_11_benefit', rating: 5 },
  { nameKey: 'review_12_name', statusKey: 'review_12_status', textKey: 'review_12_text', benefitKey: 'review_12_benefit', rating: 5 },
  { nameKey: 'review_13_name', statusKey: 'review_13_status', textKey: 'review_13_text', benefitKey: 'review_13_benefit', rating: 5 },
  { nameKey: 'review_14_name', statusKey: 'review_14_status', textKey: 'review_14_text', benefitKey: 'review_14_benefit', rating: 5 },
  { nameKey: 'review_15_name', statusKey: 'review_15_status', textKey: 'review_15_text', benefitKey: 'review_15_benefit', rating: 5 }
]

export default function Reviews() {
  const { t } = useTranslation()

  const reviews = reviewList.map((review) => ({
    name: t(review.nameKey),
    status: t(review.statusKey),
    text: t(review.textKey),
    benefit: t(review.benefitKey),
    rating: review.rating
  }))

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.07)] md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">{t('reviews_badge')}</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">{t('reviews_title')}</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600 md:text-lg">{t('reviews_subtitle')}</p>
        <div className="mt-5 inline-flex rounded-full border border-[#F8D66D]/50 bg-[#FFF8D6] px-3 py-1.5 text-xs font-semibold text-[#7C4A00]">
          {t('reviews_demo_note')}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={`${review.name}-${review.status}`}
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_15px_30px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(15,23,42,0.08)]"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-left">
                <span className="text-lg font-black text-[#D4AF37]">{review.name}</span>
                <span className="text-sm font-medium text-[#D4AF37]">{review.status}</span>
              </div>
              <div className="text-base tracking-[0.12em] text-[#D4AF37]" aria-label={`${review.rating} star review`}>
                {Array.from({ length: review.rating }).map((_, index) => (
                  <span key={`${review.name}-star-${index}`}>★</span>
                ))}
              </div>
            </div>

            <p className="text-base leading-7 text-slate-700">“{review.text}”</p>

            <div className="mt-5 border-t border-slate-200 pt-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t('review_benefit_label')}
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-800">{review.benefit}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
