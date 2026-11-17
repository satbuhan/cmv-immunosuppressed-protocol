// content.js — Ganciclovir and valganciclovir for CMV infection in
// immunosuppressed patients: a prevention/treatment decision algorithm
// (shared entry -> active-infection decision -> PREVENTION branch,
// risk-stratified by serostatus/organ/induction, with 4 population-
// specific boxes and a standalone evidence summary; or TREATMENT branch,
// severity-assessed IV-vs-oral induction -> shared immunosuppression/
// ART/retinitis step -> weekly monitoring -> ANC checkpoint -> viral-
// load/resistance checkpoint -> response endpoint). Data only. Rendering
// logic lives in app.js.
// Co-authored by Dr. Özgür Karcıoğlu and Dr. Satuk Buğra Han Bozatlı.
//
// Source: "Ganciclovir and Valganciclovir for Cytomegalovirus Infection in
// Immunosuppressed Patients: A Systematic Review of Comparative Studies on
// Clinical Outcomes, 2007-2026" (unpublished, blinded manuscript; PRISMA
// 2020 systematic review; PubMed/MEDLINE + WHO ICTRP, last search 16 Nov
// 2026; 28 included studies, 14 RCTs, 6,118 patients; 110 references) and
// its own Figure 3 decision algorithm, supplied as a standalone image.
// See METHODOLOGY.md for the fidelity rules this file follows: label/sub
// text is byte-for-byte as authored (figure boxes); meaning/rationale/
// cautions/refs are added research paraphrased from the manuscript's own
// text and tables, independently cross-checked box-by-box against the
// figure image with zero discrepancies found.
//
// WORKFLOW NOTE: the manuscript's narrative text, tables and bibliography
// were condensed into a structured extraction document by ChatGPT (ending
// a run of several tools condensed via Gemini, after repeated length-limit
// truncation errors from Gemini on this document — the reference list cut
// off mid-entry at reference 5 of 110 on the first attempt). ChatGPT's
// completed condensation came back in one pass, 110/110 references intact,
// and used the atlas's existing structured template (the same section
// headers and "UNCLEAR — manuscript says: ..." discrepancy-flagging
// convention as every Gemini-condensed tool before it), so no change to
// the downstream build process was needed. Figure 3 itself was supplied
// directly as an image and was independently checked box-by-box against
// this condensation by Claude, not inherited from a prior AI's figure
// analysis — zero discrepancies found (all 10 distinct boxes plus the two
// 2-box/4-box groups match exactly).
//
// REFERENCE VERIFICATION — explicit, author-granted exception (the NINTH
// in this atlas, same policy as epinephrine-revisited-protocol,
// ketamine-indications-protocol, haloperidol-adjunct-protocol,
// geriatric-pain-protocol, metoclopramide-ondansetron-protocol,
// spontaneous-pneumothorax-protocol, button-battery-protocol and
// beta-lactam-infusion-protocol): the author instructed that the
// 110-entry bibliography NOT be independently re-verified against primary
// sources by this session. Unlike every prior instance of this exception,
// this is not because a human or another AI had already checked them —
// verification is explicitly deferred to the author team's own clinician
// review afterward, outside this build. Every reference's `kind` field
// states plainly that this build did not re-verify it.
//
// CALCULATOR CANDIDATES: none. The condensation's own Section 6
// ("Calculator candidates flagged in this manuscript") returned "None
// flagged," and its Section 4 closing note is explicit: no named,
// weighted multi-criterion clinical score or named renal-function
// equation appears in any treatment box or its supporting text — the
// qualitative severity assessment, the ANC cutoff, and the "renal dosing"
// label are single criteria/thresholds, not scoring systems, and are not
// calculator candidates under the atlas's flagging rule.
// ========================================================================

// Date this tool's content and citations were last built/checked
// together (see assets/app.js's References summary).
const VERIFIED = null; // reference verification deferred to clinician review (see header note above)

const REFERENCES = [
  { id: 1, kind: "As cited in the manuscript; not independently re-verified.", text: "Plosa EJ, Esbenshade JC, Fuller MP, Weitkamp JH. Cytomegalovirus infection. Pediatr Rev. 2012;33:156-63; quiz 163.", url: "https://doi.org/10.1542/pir.33-4-156" },
  { id: 2, kind: "As cited in the manuscript; not independently re-verified.", text: "Griffiths P, Lumley S. Cytomegalovirus. Curr Opin Infect Dis. 2014;27:554-9.", url: "https://doi.org/10.1097/QCO.0000000000000107" },
  { id: 3, kind: "As cited in the manuscript; not independently re-verified.", text: "Vora SB, Englund JA. Cytomegalovirus in immunocompromised children. Curr Opin Infect Dis. 2015;28:323-9.", url: "https://doi.org/10.1097/QCO.0000000000000174" },
  { id: 4, kind: "As cited in the manuscript; not independently re-verified.", text: "Ariza-Heredia EJ, Nesher L, Chemaly RF. Cytomegalovirus diseases after hematopoietic stem cell transplantation: a mini-review. Cancer Lett. 2013;342:1-8.", url: "https://doi.org/10.1016/j.canlet.2013.09.004" },
  { id: 5, kind: "As cited in the manuscript; not independently re-verified.", text: "Nakagawa R, Onishi Y, Kawajiri A, Onodera K, Furukawa E, Sano S, et al. Preemptive therapy for cytomegalovirus reactivation after daratumumab-containing treatment in patients with relapsed and refractory multiple myeloma. Ann Hematol. 2019;98:1999-2001.", url: "https://doi.org/10.1007/s00277-019-03645-7" },
  { id: 6, kind: "As cited in the manuscript; not independently re-verified.", text: "Franklin C, Rooms I, Fiedler M, Reis H, Milsch L, Herz S, et al. Cytomegalovirus reactivation in patients with refractory checkpoint inhibitor-induced colitis. Eur J Cancer. 2017;86:248-256.", url: "https://doi.org/10.1016/j.ejca.2017.09.019" },
  { id: 7, kind: "As cited in the manuscript; not independently re-verified.", text: "Kotton CN, Kamar N. New Insights on CMV Management in Solid Organ Transplant Patients: Prevention, Treatment, and Management of Resistant/Refractory Disease. Infect Dis Ther. 2022;12:333-342.", url: "https://doi.org/10.1007/s40121-022-00746-1" },
  { id: 8, kind: "As cited in the manuscript; not independently re-verified.", text: "Baroco AL, Oldfield EC. Gastrointestinal cytomegalovirus disease in the immunocompromised patient. Curr Gastroenterol Rep. 2008;10:409-16.", url: "https://doi.org/10.1007/s11894-008-0077-9" },
  { id: 9, kind: "As cited in the manuscript; not independently re-verified.", text: "Yong MK, Slavin MA, Kontoyiannis DP. Invasive fungal disease and cytomegalovirus infection: is there an association?. Curr Opin Infect Dis. 2018;31:481-489.", url: "https://doi.org/10.1097/QCO.0000000000000502" },
  { id: 10, kind: "As cited in the manuscript; not independently re-verified.", text: "Akman C, Erdem B, Ucar AB, Inci O, Unaldi M, Ozkaya B, et al. Safety and Efficacy of Therapeutic Agents in Viral Pneumonia in Immunosuppressed Patients. Curr Pharm Des. 2026. [Epub ahead of print].", url: "https://doi.org/10.2174/0113816128507869260921060329" },
  { id: 11, kind: "As cited in the manuscript; not independently re-verified.", text: "Ahmed A. Antiviral treatment of cytomegalovirus infection. Infect Disord Drug Targets. 2011;11:475-503.", url: "https://doi.org/10.2174/187152611797636640" },
  { id: 12, kind: "As cited in the manuscript; not independently re-verified.", text: "James SH, Prichard MN. The genetic basis of human cytomegalovirus resistance and current trends in antiviral resistance analysis. Infect Disord Drug Targets. 2011;11:504-13.", url: "https://doi.org/10.2174/187152611797636668" },
  { id: 13, kind: "As cited in the manuscript; not independently re-verified.", text: "Manuel O, Perrottet N, Pascual M. Valganciclovir to prevent or treat cytomegalovirus disease in organ transplantation. Expert Rev Anti Infect Ther. 2011;9:955-65.", url: "https://doi.org/10.1586/eri.11.116" },
  { id: 14, kind: "As cited in the manuscript; not independently re-verified.", text: "Asberg A, Rollag H, Hartmann A. Valganciclovir for the prevention and treatment of CMV in solid organ transplant recipients. Expert Opin Pharmacother. 2010;11:1159-66.", url: "https://doi.org/10.1517/14656561003742954" },
  { id: 15, kind: "As cited in the manuscript; not independently re-verified.", text: "Kotton CN, Kumar D, Caliendo AM, Huprikar S, Chou S, Danziger-Isakov L, et al. The Third International Consensus Guidelines on the Management of Cytomegalovirus in Solid-organ Transplantation. Transplantation. 2018;102:900-931.", url: "https://doi.org/10.1097/TP.0000000000002191" },
  { id: 16, kind: "As cited in the manuscript; not independently re-verified.", text: "Kotton CN, Kumar D, Manuel O, Chou S, Hayden RT, Danziger-Isakov L, et al. The Fourth International Consensus Guidelines on the Management of Cytomegalovirus in Solid Organ Transplantation. Transplantation. 2025;109:1066-1110.", url: "https://doi.org/10.1097/TP.0000000000005374" },
  { id: 17, kind: "As cited in the manuscript; not independently re-verified.", text: "Ljungman P, de la Camara R, Robin C, Crocchiolo R, Einsele H, Hill JA, et al. Guidelines for the management of cytomegalovirus infection in patients with haematological malignancies and after stem cell transplantation from the 2017 European Conference on Infections in Leukaemia (ECIL 7). Lancet Infect Dis. 2019;19:e260-e272.", url: "https://doi.org/10.1016/S1473-3099(19)30107-0" },
  { id: 18, kind: "As cited in the manuscript; not independently re-verified.", text: "Jacobsen T, Sifontis N. Drug interactions and toxicities associated with the antiviral management of cytomegalovirus infection. Am J Health Syst Pharm. 2010;67:1417-25.", url: "https://doi.org/10.2146/ajhp090424" },
  { id: 19, kind: "As cited in the manuscript; not independently re-verified.", text: "Venton G, Crocchiolo R, Fürst S, Granata A, Oudin C, Faucher C, et al. Risk factors of Ganciclovir-related neutropenia after allogeneic stem cell transplantation: a retrospective monocentre study on 547 patients. Clin Microbiol Infect. 2013;20:160-6.", url: "https://doi.org/10.1111/1469-0691.12222" },
  { id: 20, kind: "As cited in the manuscript; not independently re-verified.", text: "Chou S. Approach to drug-resistant cytomegalovirus in transplant recipients. Curr Opin Infect Dis. 2015;28:293-9.", url: "https://doi.org/10.1097/QCO.0000000000000170" },
  { id: 21, kind: "As cited in the manuscript; not independently re-verified.", text: "Lynch K, Märtson AG. The importance of drug exposure in the development of cytomegalovirus resistance. Int J Antimicrob Agents. 2025;66:107537.", url: "https://doi.org/10.1016/j.ijantimicag.2025.107537" },
  { id: 22, kind: "As cited in the manuscript; not independently re-verified.", text: "van Vugt LK, Hesselink DA, de Winter BCM. Challenges for the improvement of valganciclovir prophylaxis in solid organ transplantation and the possible role of therapeutic drug monitoring in adults. Br J Clin Pharmacol. 2024;91:1551-1559.", url: "https://doi.org/10.1111/bcp.16138" },
  { id: 23, kind: "As cited in the manuscript; not independently re-verified.", text: "Melendez DP, Razonable RR. Letermovir and inhibitors of the terminase complex: a promising new class of investigational antiviral drugs against human cytomegalovirus. Infect Drug Resist. 2015;8:269-77.", url: "https://doi.org/10.2147/IDR.S79131" },
  { id: 24, kind: "As cited in the manuscript; not independently re-verified.", text: "Marty FM, Ljungman P, Chemaly RF, Maertens J, Dadwal SS, Duarte RF, et al. Letermovir Prophylaxis for Cytomegalovirus in Hematopoietic-Cell Transplantation. N Engl J Med. 2017;377:2433-2444.", url: "https://doi.org/10.1056/NEJMoa1706640" },
  { id: 25, kind: "As cited in the manuscript; not independently re-verified.", text: "Hakki M. Moving Past Ganciclovir and Foscarnet: Advances in CMV Therapy. Curr Hematol Malig Rep. 2020;15:90-102.", url: "https://doi.org/10.1007/s11899-020-00557-6" },
  { id: 26, kind: "As cited in the manuscript; not independently re-verified.", text: "Vernooij RW, Michael M, Ladhani M, Webster AC, Strippoli GF, Craig JC, et al. Antiviral medications for preventing cytomegalovirus disease in solid organ transplant recipients. Cochrane Database Syst Rev. 2024;5:CD003774.", url: "https://doi.org/10.1002/14651858.CD003774.pub5" },
  { id: 27, kind: "As cited in the manuscript; not independently re-verified.", text: "Vernooij RW, Michael M, Colombijn JM, Owers DS, Webster AC, Strippoli GF, et al. Pre-emptive treatment for cytomegalovirus viraemia to prevent cytomegalovirus disease in solid organ transplant recipients. Cochrane Database Syst Rev. 2025;1:CD005133.", url: "https://doi.org/10.1002/14651858.CD005133.pub4" },
  { id: 28, kind: "As cited in the manuscript; not independently re-verified.", text: "Chen K, Cheng MP, Hammond SP, Einsele H, Marty FM. Antiviral prophylaxis for cytomegalovirus infection in allogeneic hematopoietic cell transplantation. Blood Adv. 2018;2:2159-2175.", url: "https://doi.org/10.1182/bloodadvances.2018016493" },
  { id: 29, kind: "As cited in the manuscript; not independently re-verified.", text: "Hwang SD, Lee JH, Lee SW, Kim JK, Kim MJ, Song JH. Effect of Low-Dose Vs Standard-Dose Valganciclovir in the Prevention of Cytomegalovirus Disease in Kidney Transplantation Recipients: A Systemic Review and Meta-Analysis. Transplant Proc. 2018;50:2473-2478.", url: "https://doi.org/10.1016/j.transproceed.2018.01.023" },
  { id: 30, kind: "As cited in the manuscript; not independently re-verified.", text: "Togashi J, Sugawara Y, Hashimoto M, Tamura S, Kaneko J, Aoki T, et al. Oral valganciclovir versus intravenous ganciclovir as preemptive treatment for cytomegalovirus infection after living donor liver transplantation: a randomized trial. Biosci Trends. 2011;5:217-22.", url: "https://doi.org/10.5582/bst.2011.v5.5.217" },
  { id: 31, kind: "As cited in the manuscript; not independently re-verified.", text: "Choopong P, Vivittaworn K, Konlakij D, Thoongsuwan S, Pituksung A, Tesavibul N. Treatment outcomes of reduced-dose intravitreal ganciclovir for cytomegalovirus retinitis. BMC Infect Dis. 2016;16:164.", url: "https://doi.org/10.1186/s12879-016-1490-6" },
  { id: 32, kind: "As cited in the manuscript; not independently re-verified.", text: "Asberg A, Humar A, Rollag H, Jardine AG, Mouas H, Pescovitz MD, et al. Oral valganciclovir is noninferior to intravenous ganciclovir for the treatment of cytomegalovirus disease in solid organ transplant recipients. Am J Transplant. 2007;7:2106-13.", url: "https://doi.org/10.1111/j.1600-6143.2007.01910.x" },
  { id: 33, kind: "As cited in the manuscript; not independently re-verified.", text: "Asberg A, Humar A, Jardine AG, Rollag H, Pescovitz MD, Mouas H, et al. Long-term outcomes of CMV disease treatment with valganciclovir versus IV ganciclovir in solid organ transplant recipients. Am J Transplant. 2009;9:1205-13.", url: "https://doi.org/10.1111/j.1600-6143.2009.02617.x" },
  { id: 34, kind: "As cited in the manuscript; not independently re-verified.", text: "Boivin G, Goyette N, Rollag H, Jardine AG, Pescovitz MD, Asberg A, et al. Cytomegalovirus resistance in solid organ transplant recipients treated with intravenous ganciclovir or oral valganciclovir. Antivir Ther. 2009;14:697-704. PMID: 19704173 (no DOI given in the manuscript).", url: "https://pubmed.ncbi.nlm.nih.gov/19704173/" },
  { id: 35, kind: "As cited in the manuscript; not independently re-verified.", text: "Witzke O, Hauser IA, Bartels M, Wolf G, Wolters H, Nitschke M. Valganciclovir prophylaxis versus preemptive therapy in cytomegalovirus-positive renal allograft recipients: 1-year results of a randomized clinical trial. Transplantation. 2012;93:61-8.", url: "https://doi.org/10.1097/TP.0b013e318238dab3" },
  { id: 36, kind: "As cited in the manuscript; not independently re-verified.", text: "Witzke O, Nitschke M, Bartels M, Wolters H, Wolf G, Reinke P, et al. Valganciclovir Prophylaxis Versus Preemptive Therapy in Cytomegalovirus-Positive Renal Allograft Recipients: Long-term Results After 7 Years of a Randomized Clinical Trial. Transplantation. 2018;102:876-882.", url: "https://doi.org/10.1097/TP.0000000000002024" },
  { id: 37, kind: "As cited in the manuscript; not independently re-verified.", text: "Reischig T, Vlas T, Kacer M, Pivovarcikova K, Lysak D, Nemcova J, et al. A Randomized Trial of Valganciclovir Prophylaxis Versus Preemptive Therapy in Kidney Transplant Recipients. J Am Soc Nephrol. 2023;34:920-934.", url: "https://doi.org/10.1681/ASN.0000000000000090" },
  { id: 38, kind: "As cited in the manuscript; not independently re-verified.", text: "Reischig T, Jindra P, Hes O, Svecová M, Klaboch J, Treska V. Valacyclovir prophylaxis versus preemptive valganciclovir therapy to prevent cytomegalovirus disease after renal transplantation. Am J Transplant. 2007;8:69-77.", url: "https://doi.org/10.1111/j.1600-6143.2007.02031.x" },
  { id: 39, kind: "As cited in the manuscript; not independently re-verified.", text: "Singh N, Winston DJ, Razonable RR, Lyon GM, Silveira FP, Wagener MM, et al. Effect of Preemptive Therapy vs Antiviral Prophylaxis on Cytomegalovirus Disease in Seronegative Liver Transplant Recipients With Seropositive Donors: A Randomized Clinical Trial. JAMA. 2020;323:1378-1387.", url: "https://doi.org/10.1001/jama.2020.3138" },
  { id: 40, kind: "As cited in the manuscript; not independently re-verified.", text: "Singh N, Winston DJ, Razonable RR, Lyon GM, Silveira FP, Wagener MM, et al. Cost-effectiveness of Preemptive Therapy Versus Prophylaxis in a Randomized Clinical Trial for the Prevention of Cytomegalovirus Disease in Seronegative Liver Transplant Recipients With Seropositive Donors. Clin Infect Dis. 2021;73:e2739-e2745.", url: "https://doi.org/10.1093/cid/ciaa1051" },
  { id: 41, kind: "As cited in the manuscript; not independently re-verified.", text: "Liu AW, Jutivorakool K, Fisher CE, Rakita RM, Reyes JD, Bhattacharya RB, et al. Comparison of Preemptive Therapy and Antiviral Prophylaxis for Prevention of Cytomegalovirus in Seropositive Liver Transplant Recipients. Transplantation. 2018;102:632-639.", url: "https://doi.org/10.1097/TP.0000000000002029" },
  { id: 42, kind: "As cited in the manuscript; not independently re-verified.", text: "Höcker B, Zencke S, Krupka K, Fichtner A, Pape L, Dello Strologo L, et al. Cytomegalovirus Infection in Pediatric Renal Transplantation and the Impact of Chemoprophylaxis With (Val-)Ganciclovir. Transplantation. 2016;100:862-70.", url: "https://doi.org/10.1097/TP.0000000000000888" },
  { id: 43, kind: "As cited in the manuscript; not independently re-verified.", text: "Humar A, Limaye AP, Blumberg EA, Hauser IA, Vincenti F, Jardine AG, et al. Extended valganciclovir prophylaxis in D+/R- kidney transplant recipients is associated with long-term reduction in cytomegalovirus disease: two-year results of the IMPACT study. Transplantation. 2010;90:1427-31.", url: "https://doi.org/10.1097/tp.0b013e3181ff1493" },
  { id: 44, kind: "As cited in the manuscript; not independently re-verified.", text: "Fleming JN, Taber DJ, Weimert NA, Nadig S, McGillicuddy JW, Bratton CF, et al. Valganciclovir (VGCV) followed by cytomegalovirus (CMV) hyperimmune globulin compared to VGCV for 200 days in abdominal organ transplant recipients at high risk for CMV infection: A prospective, randomized pilot study. Transpl Infect Dis. 2017;19.", url: "https://doi.org/10.1111/tid.12779" },
  { id: 45, kind: "As cited in the manuscript; not independently re-verified.", text: "Ueno T, Kodama T, Noguchi Y, Deguchi K, Nomura M, Saka R, et al. One Year of Preemptive Valganciclovir Administration in Children After Liver Transplantation. Transplant Proc. 2020;52:1852-1854.", url: "https://doi.org/10.1016/j.transproceed.2020.01.163" },
  { id: 46, kind: "As cited in the manuscript; not independently re-verified.", text: "Halim MA, Al-Otaibi T, Gheith O, Adel H, Mosaad A, Hasaneen AA, et al. Efficacy and Safety of Low-Dose Versus Standard-Dose Valganciclovir for Prevention of Cytomegalovirus Disease in Intermediate-Risk Kidney Transplant Recipients. Exp Clin Transplant. 2016;14:526-534.", url: "https://doi.org/10.6002/ect.2015.0305" },
  { id: 47, kind: "As cited in the manuscript; not independently re-verified.", text: "Gabardi S, Asipenko N, Fleming J, Lor K, McDevitt-Potter L, Mohammed A, et al. Evaluation of Low- Versus High-dose Valganciclovir for Prevention of Cytomegalovirus Disease in High-risk Renal Transplant Recipients. Transplantation. 2015;99:1499-505.", url: "https://doi.org/10.1097/TP.0000000000000570" },
  { id: 48, kind: "As cited in the manuscript; not independently re-verified.", text: "Khan S, Sullivan T, Ali M, Dunn D, Patel G, Huprikar S. Low-dose valganciclovir for cytomegalovirus prophylaxis in intermediate-risk liver transplantation recipients. Liver Transpl. 2018;24:616-622.", url: "https://doi.org/10.1002/lt.25047" },
  { id: 49, kind: "As cited in the manuscript; not independently re-verified.", text: "McKeen JT, Tsapepas DS, Li H, Anamisis A, Martin ST. Acyclovir versus valganciclovir for preventing cytomegalovirus infection in intermediate-risk liver transplant recipients. Prog Transplant. 2015;25:39-44.", url: "https://doi.org/10.7182/pit2015558" },
  { id: 50, kind: "As cited in the manuscript; not independently re-verified.", text: "Páez-Vega A, Gutiérrez-Gutiérrez B, Agüera ML, Facundo C, Redondo-Pachón D, Suñer M, et al. Immunoguided Discontinuation of Prophylaxis for Cytomegalovirus Disease in Kidney Transplant Recipients Treated With Antithymocyte Globulin: A Randomized Clinical Trial. Clin Infect Dis. 2022;74:757-765.", url: "https://doi.org/10.1093/cid/ciab574" },
  { id: 51, kind: "As cited in the manuscript; not independently re-verified.", text: "Páez-Vega A, Vaquero-Barrios JM, Ruiz-Arabi E, Iturbe-Fernández D, Alonso R, Ussetti-Gil P, et al. Safety and efficacy of immunoguided prophylaxis for cytomegalovirus disease in low-risk lung transplant recipients in Spain: a multicentre, open-label, randomised, phase 3, noninferiority trial. Lancet Reg Health Eur. 2025;52:101268.", url: "https://doi.org/10.1016/j.lanepe.2025.101268" },
  { id: 52, kind: "As cited in the manuscript; not independently re-verified.", text: "Limaye AP, Budde K, Humar A, Vincenti F, Kuypers DRJ, Carroll RP, et al. Letermovir vs Valganciclovir for Prophylaxis of Cytomegalovirus in High-Risk Kidney Transplant Recipients: A Randomized Clinical Trial. JAMA. 2023;330:33-42.", url: "https://doi.org/10.1001/jama.2023.9106" },
  { id: 53, kind: "As cited in the manuscript; not independently re-verified.", text: "Bunnapradist S, Vincenti F, Witzke O, Schneeberger S, Nguyen MH, Broyde N, et al. Favorable Adherence and Tolerability of Letermovir Versus Valganciclovir for Cytomegalovirus Prophylaxis in Kidney Transplant Recipients Aged 65 y or Older: Findings From a Randomized, Phase 3 Trial. Transplant Direct. 2026;12:e1990.", url: "https://doi.org/10.1097/TXD.0000000000001990" },
  { id: 54, kind: "As cited in the manuscript; not independently re-verified.", text: "Limaye AP, Crespo M, Kamar N, Humar A, Carroll RP, Pereira MR, et al. Cytomegalovirus (CMV)-Specific Cell-Mediated Immunity for Prediction of Postprophylaxis CMV Disease in a Phase 3 Trial of Letermovir Versus Valganciclovir Prophylaxis in Donor CMV-Seropositive/Recipient CMV-Seronegative Kidney Transplant Recipients. Clin Infect Dis. 2026;82:e316-e324.", url: "https://doi.org/10.1093/cid/ciaf632" },
  { id: 55, kind: "As cited in the manuscript; not independently re-verified.", text: "Martinez S, Sindu D, Nailor MD, Cherrier L, Tokman S, Walia R, et al. Evaluating the efficacy and safety of letermovir compared to valganciclovir for the prevention of human cytomegalovirus disease in adult lung transplant recipients. Transpl Infect Dis. 2024;26:e14279.", url: "https://doi.org/10.1111/tid.14279" },
  { id: 56, kind: "As cited in the manuscript; not independently re-verified.", text: "Kleiboeker HL, Wang J, Borkowski N, Miner B, Prom A, Paplaczyk K, et al. Use of letermovir for cytomegalovirus primary prophylaxis in lung transplant recipients. Transpl Infect Dis. 2024;26:e14337.", url: "https://doi.org/10.1111/tid.14337" },
  { id: 57, kind: "As cited in the manuscript; not independently re-verified.", text: "Papanicolaou GA, Avery RK, Cordonnier C, Duarte RF, Haider S, Maertens J, et al. Treatment for First Cytomegalovirus Infection Post-Hematopoietic Cell Transplant in the AURORA Trial: A Multicenter, Double-Blind, Randomized, Phase 3 Trial Comparing Maribavir With Valganciclovir. Clin Infect Dis. 2024;78:562-572.", url: "https://doi.org/10.1093/cid/ciad709" },
  { id: 58, kind: "As cited in the manuscript; not independently re-verified.", text: "Chou S, Winston DJ, Avery RK, Cordonnier C, Duarte RF, Haider S, et al. Comparative Emergence of Maribavir and Ganciclovir Resistance in a Randomized Phase 3 Clinical Trial for Treatment of Cytomegalovirus Infection. J Infect Dis. 2025;231:e470-e477.", url: "https://doi.org/10.1093/infdis/jiae469" },
  { id: 59, kind: "As cited in the manuscript; not independently re-verified.", text: "Avery RK, Alain S, Alexander BD, Blumberg EA, Chemaly RF, Cordonnier C, et al. Maribavir for Refractory Cytomegalovirus Infections With or Without Resistance Post-Transplant: Results From a Phase 3 Randomized Clinical Trial. Clin Infect Dis. 2022;75:690-701.", url: "https://doi.org/10.1093/cid/ciab988" },
  { id: 60, kind: "As cited in the manuscript; not independently re-verified.", text: "Chou S, Alain S, Cervera C, Chemaly RF, Kotton CN, Lundgren J, et al. Drug Resistance Assessed in a Phase 3 Clinical Trial of Maribavir Therapy for Refractory or Resistant Cytomegalovirus Infection in Transplant Recipients. J Infect Dis. 2024;229:413-421.", url: "https://doi.org/10.1093/infdis/jiad293" },
  { id: 61, kind: "As cited in the manuscript; not independently re-verified.", text: "Miyao K, Terakura S, Ozawa Y, Sawa M, Kohno A, Kasahara S, et al. Comparison of Transplantation Outcomes after Foscarnet and Ganciclovir Administration as First-Line Anti-Cytomegalovirus Preemptive Therapy. Transplant Cell Ther. 2020;27:342.e1-342.e10.", url: "https://doi.org/10.1016/j.jtct.2020.12.012" },
  { id: 62, kind: "As cited in the manuscript; not independently re-verified.", text: "Camacho-Bydume C, Mauguen A, Rodriguez-Sanchez MI, Klein E, Kernan NA, Prockop S, et al. Time to initiation of pre-emptive therapy for cytomegalovirus impacts overall survival in pediatric hematopoietic stem cell transplant recipients. Cytotherapy. 2022;24:428-436.", url: "https://doi.org/10.1016/j.jcyt.2021.10.002" },
  { id: 63, kind: "As cited in the manuscript; not independently re-verified.", text: "Tan CA, Palen L, Su Y, Li Y, Gennarelli RL, Perales MA, et al. Impact of Primary Letermovir Prophylaxis Versus Preemptive Antiviral Therapy for Cytomegalovirus on Economic and Clinical Outcomes after Hematopoietic Cell Transplantation. Transplant Cell Ther. 2024;30:792.e1-792.e12.", url: "https://doi.org/10.1016/j.jtct.2024.05.021" },
  { id: 64, kind: "As cited in the manuscript; not independently re-verified.", text: "Vora SB, Brothers AW, Waghmare A, Englund JA. Antiviral combination therapy for cytomegalovirus infection in high-risk infants. Antivir Ther. 2018;23:505-511.", url: "https://doi.org/10.3851/IMP3238" },
  { id: 65, kind: "As cited in the manuscript; not independently re-verified.", text: "Jabs DA, Ahuja A, Van Natta M, Dunn JP, Yeh S. Comparison of treatment regimens for cytomegalovirus retinitis in patients with AIDS in the era of highly active antiretroviral therapy. Ophthalmology. 2013;120:1262-70.", url: "https://doi.org/10.1016/j.ophtha.2012.11.023" },
  { id: 66, kind: "As cited in the manuscript; not independently re-verified.", text: "Mattioni S, Pavie J, Porcher R, Scieux C, Denis B, De Castro N, et al. Assessment of the efficacy and safety of pre-emptive anti-cytomegalovirus (CMV) therapy in HIV-infected patients with CMV viraemia. Int J STD AIDS. 2014;26:306-12.", url: "https://doi.org/10.1177/0956462414536146" },
  { id: 67, kind: "As cited in the manuscript; not independently re-verified.", text: "Åsberg A, Humar A, Rollag H, Jardine AG, Kumar D, Aukrust P, et al. Lessons Learned From a Randomized Study of Oral Valganciclovir Versus Parenteral Ganciclovir Treatment of Cytomegalovirus Disease in Solid Organ Transplant Recipients: The VICTOR Trial. Clin Infect Dis. 2016;62:1154-60.", url: "https://doi.org/10.1093/cid/ciw084" },
  { id: 68, kind: "As cited in the manuscript; not independently re-verified.", text: "Singh N, Winston DJ, Razonable RR, Lyon GM, Silveira FP, Wagener MM, et al. Risk Factors for Cytomegalovirus Viremia following Liver Transplantation With a Seropositive Donor and Seronegative Recipient Receiving Antiviral Therapy. J Infect Dis. 2021;223:1073-1077.", url: "https://doi.org/10.1093/infdis/jiaa470" },
  { id: 69, kind: "As cited in the manuscript; not independently re-verified.", text: "Singh N, Winston DJ, Razonable RR, Lyon GM, Huang ML, Jerome KR, et al. Association of HHV-6 With Outcomes in CMV-seronegative Liver Transplant Recipients With CMV-seropositive Donors Receiving Preemptive Antiviral Therapy. Transplantation. 2021;105:2427-2434.", url: "https://doi.org/10.1097/TP.0000000000003604" },
  { id: 70, kind: "As cited in the manuscript; not independently re-verified.", text: "Blumberg EA, Hauser IA, Stanisic S, Mueller E, Berenson K, Gahlemann CG, et al. Prolonged prophylaxis with valganciclovir is cost effective in reducing posttransplant cytomegalovirus disease within the United States. Transplantation. 2010;90:1420-6.", url: "https://doi.org/10.1097/TP.0b013e3181ff500d" },
  { id: 71, kind: "As cited in the manuscript; not independently re-verified.", text: "Hodson EM, Craig JC, Strippoli GF, Webster AC. Antiviral medications for preventing cytomegalovirus disease in solid organ transplant recipients. Cochrane Database Syst Rev. 2008:CD003774. [Epub ahead of print].", url: "https://doi.org/10.1002/14651858.CD003774.pub3" },
  { id: 72, kind: "As cited in the manuscript; not independently re-verified.", text: "Owers DS, Webster AC, Strippoli GF, Kable K, Hodson EM. Pre-emptive treatment for cytomegalovirus viraemia to prevent cytomegalovirus disease in solid organ transplant recipients. Cochrane Database Syst Rev. 2013;2013:CD005133.", url: "https://doi.org/10.1002/14651858.CD005133.pub3" },
  { id: 73, kind: "As cited in the manuscript; not independently re-verified.", text: "Kumar L, Murray-Krezan C, Singh N, Brennan DC, Rakita RM, Dasgupta S, et al. A Systematic Review and Meta-analysis of Optimized CMV Preemptive Therapy and Antiviral Prophylaxis for CMV Disease Prevention in CMV High-Risk (D+R-) Kidney Transplant Recipients. Transplant Direct. 2023;9:e1514.", url: "https://doi.org/10.1097/TXD.0000000000001514" },
  { id: 74, kind: "As cited in the manuscript; not independently re-verified.", text: "Ruenroengbun N, Sapankaew T, Chaiyakittisopon K, Phoompoung P, Ngamprasertchai T. Efficacy and Safety of Antiviral Agents in Preventing Allograft Rejection Following CMV Prophylaxis in High-Risk Kidney Transplantation: A Systematic Review and Network Meta-Analysis of Randomized Controlled Trials. Front Cell Infect Microbiol. 2022;12:865735.", url: "https://doi.org/10.3389/fcimb.2022.865735" },
  { id: 75, kind: "As cited in the manuscript; not independently re-verified.", text: "Kotton CN, Kumar D, Caliendo AM, Asberg A, Chou S, Danziger-Isakov L, et al. Updated international consensus guidelines on the management of cytomegalovirus in solid-organ transplantation. Transplantation. 2013;96:333-60.", url: "https://doi.org/10.1097/TP.0b013e31829df29d" },
  { id: 76, kind: "As cited in the manuscript; not independently re-verified.", text: "Kotton CN, Kumar D, Caliendo AM, Asberg A, Chou S, Snydman DR, et al. International consensus guidelines on the management of cytomegalovirus in solid organ transplantation. Transplantation. 2010;89:779-95.", url: "https://doi.org/10.1097/TP.0b013e3181cee42f" },
  { id: 77, kind: "As cited in the manuscript; not independently re-verified.", text: "Kalil AC, Freifeld AG, Lyden ER, Stoner JA. Valganciclovir for cytomegalovirus prevention in solid organ transplant patients: an evidence-based reassessment of safety and efficacy. PLoS One. 2009;4:e5512.", url: "https://doi.org/10.1371/journal.pone.0005512" },
  { id: 78, kind: "As cited in the manuscript; not independently re-verified.", text: "Xin W, Hui Y, Xiaodong Z, Xiangli C, Shihui W, Lihong L. Effectiveness of Valganciclovir 900mg Versus 450mg for Cytomegalovirus Prophylaxis in Renal Transplantation: A Systematic Review and Meta-Analysis. J Pharm Pharm Sci. 2017;20:168-183.", url: "https://doi.org/10.18433/J3805B" },
  { id: 79, kind: "As cited in the manuscript; not independently re-verified.", text: "Lee JH, Lee H, Lee SW, Hwang SD, Song JH. Efficacy and Safety According to the Dose of Valganciclovir for Cytomegalovirus Prophylaxis in Transplantation: Network Meta-analysis Using Recent Data. Transplant Proc. 2021;53:1945-1950.", url: "https://doi.org/10.1016/j.transproceed.2021.05.006" },
  { id: 80, kind: "As cited in the manuscript; not independently re-verified.", text: "Wong DD, van Zuylen WJ, Craig ME, Rawlinson WD. Systematic review of ganciclovir pharmacodynamics during the prevention of cytomegalovirus infection in adult solid organ transplant recipients. Rev Med Virol. 2018;29:e2023.", url: "https://doi.org/10.1002/rmv.2023" },
  { id: 81, kind: "As cited in the manuscript; not independently re-verified.", text: "Dvořáčková E, Michaličková D, Petrus J, Klapková E, Dutková A, Kotowski T, et al. Population Pharmacokinetics and Dose Optimization of Valganciclovir and Ganciclovir in Lung Transplant Recipients. Med Princ Pract. 2025;35:169-180.", url: "https://doi.org/10.1159/000548942" },
  { id: 82, kind: "As cited in the manuscript; not independently re-verified.", text: "Yang W, Irwin A, Weerdenburg H, McWhinney B, Cole T, Lei A, et al. Serum ganciclovir drug exposure in children receiving standard ganciclovir dosing. Antimicrob Agents Chemother. 2024;68:e0052524.", url: "https://doi.org/10.1128/aac.00525-24" },
  { id: 83, kind: "As cited in the manuscript; not independently re-verified.", text: "Yang W, Irwin A, Weerdenburg H, McWhinney B, Cole T, Lei A, et al. Identifying a therapeutic target for ganciclovir against cytomegalovirus in immunocompromised children. Br J Clin Pharmacol. 2025;92:851-859.", url: "https://doi.org/10.1002/bcp.70315" },
  { id: 84, kind: "As cited in the manuscript; not independently re-verified.", text: "Gao M, Weerdenburg H, Yang W, Zhu X, Gwee A. Defining a Therapeutic Target for Ganciclovir Therapy in Immunocompromised Children With Cytomegalovirus Infection: A Brief Report. Pediatr Infect Dis J. 2024;44:326-329.", url: "https://doi.org/10.1097/INF.0000000000004602" },
  { id: 85, kind: "As cited in the manuscript; not independently re-verified.", text: "Stockmann C, Roberts JK, Knackstedt ED, Spigarelli MG, Sherwin CM. Clinical pharmacokinetics and pharmacodynamics of ganciclovir and valganciclovir in children with cytomegalovirus infection. Expert Opin Drug Metab Toxicol. 2014;11:205-19.", url: "https://doi.org/10.1517/17425255.2015.988139" },
  { id: 86, kind: "As cited in the manuscript; not independently re-verified.", text: "Chemaly RF, Ullmann AJ, Stoelben S, Richard MP, Bornhäuser M, Groth C, et al. Letermovir for cytomegalovirus prophylaxis in hematopoietic-cell transplantation. N Engl J Med. 2014;370:1781-9.", url: "https://doi.org/10.1056/NEJMoa1309533" },
  { id: 87, kind: "As cited in the manuscript; not independently re-verified.", text: "Ljungman P, Schmitt M, Marty FM, Maertens J, Chemaly RF, Kartsonis NA, et al. A Mortality Analysis of Letermovir Prophylaxis for Cytomegalovirus (CMV) in CMV-seropositive Recipients of Allogeneic Hematopoietic Cell Transplantation. Clin Infect Dis. 2020;70:1525-1533.", url: "https://doi.org/10.1093/cid/ciz490" },
  { id: 88, kind: "As cited in the manuscript; not independently re-verified.", text: "Russo D, Schmitt M, Pilorge S, Stelljes M, Kawakita T, Teal VL, et al. Efficacy and safety of extended duration letermovir prophylaxis in recipients of haematopoietic stem-cell transplantation at risk of cytomegalovirus infection: a multicentre, randomised, double-blind, placebo-controlled, phase 3 trial. Lancet Haematol. 2023;11:e127-e135.", url: "https://doi.org/10.1016/S2352-3026(23)00344-7" },
  { id: 89, kind: "As cited in the manuscript; not independently re-verified.", text: "Pütz SM, Wingen-Heimann SM, Classen AY, Blau IW, Bug G, Hebermehl C, et al. Real-world experience with letermovir for cytomegalovirus-prophylaxis after allogeneic hematopoietic cell transplantation: A multi-centre observational study. J Infect. 2024;89:106220.", url: "https://doi.org/10.1016/j.jinf.2024.106220" },
  { id: 90, kind: "As cited in the manuscript; not independently re-verified.", text: "Sepassi A, Saunders IM, Bounthavong M, Taplitz RA, Logan C, Watanabe JH. Effectiveness of letermovir for cytomegalovirus prophylaxis in allogeneic hematopoietic stem cell transplant recipients: A global systematic review. J Am Pharm Assoc (2003). 2023;63:1138-1149.", url: "https://doi.org/10.1016/j.japh.2023.05.015" },
  { id: 91, kind: "As cited in the manuscript; not independently re-verified.", text: "Aldalati AY, Hussein AM, Balbaa E, Hammadeh BM, Idrees M, Aloudat O, et al. Efficacy and Safety of Letermovir for Cytomegalovirus Prophylaxis in Pediatric Hematopoietic Stem Cell Transplantation Recipients: A Systematic Review, Meta-Analysis, and Meta-Regression. Transpl Infect Dis. 2025;27:e70006.", url: "https://doi.org/10.1111/tid.70006" },
  { id: 92, kind: "As cited in the manuscript; not independently re-verified.", text: "Usman M, Yuan Z, Yu H, Chen X, Tang Z, Liu C, et al. Beyond valganciclovir: A meta-analysis of letermovir's safety and efficacy in cytomegalovirus prophylaxis after solid organ transplantation. BMC Infect Dis. 2026;26.", url: "https://doi.org/10.1186/s12879-026-13022-1" },
  { id: 93, kind: "As cited in the manuscript; not independently re-verified.", text: "Bacigalupo A, Boyd A, Slipper J, Curtis J, Clissold S. Foscarnet in the management of cytomegalovirus infections in hematopoietic stem cell transplant patients. Expert Rev Anti Infect Ther. 2012;10:1249-64.", url: "https://doi.org/10.1586/eri.12.115" },
  { id: 94, kind: "As cited in the manuscript; not independently re-verified.", text: "Asakura M, Ikegame K, Yoshihara S, Taniguchi S, Mori T, Etoh T, et al. Use of foscarnet for cytomegalovirus infection after allogeneic hematopoietic stem cell transplantation from a related donor. Int J Hematol. 2010;92:351-9.", url: "https://doi.org/10.1007/s12185-010-0657-y" },
  { id: 95, kind: "As cited in the manuscript; not independently re-verified.", text: "Ogawa L, Morinishi C, Multani A, Gaynor P, Beaird OE, Pham C, et al. Real-World Comparison of Maribavir to Foscarnet for the Treatment of Cytomegalovirus in Solid Organ and Hematopoietic Stem Cell Transplant Recipients. Viruses. 2024;16.", url: "https://doi.org/10.3390/v16121889" },
  { id: 96, kind: "As cited in the manuscript; not independently re-verified.", text: "Ambrose T, Sharkey LM, Louis-Auguste J, Rutter CS, Duncan S, English S, et al. Cytomegalovirus Infection and Rates of Antiviral Resistance Following Intestinal and Multivisceral Transplantation. Transplant Proc. 2016;48:492-6.", url: "https://doi.org/10.1016/j.transproceed.2015.09.070" },
  { id: 97, kind: "As cited in the manuscript; not independently re-verified.", text: "Teoh SC, Ou X, Lim TH. Intravitreal ganciclovir maintenance injection for cytomegalovirus retinitis: efficacy of a low-volume, intermediate-dose regimen. Ophthalmology. 2011;119:588-95.", url: "https://doi.org/10.1016/j.ophtha.2011.09.004" },
  { id: 98, kind: "As cited in the manuscript; not independently re-verified.", text: "Agarwal A, Kumari N, Trehan A, Khadwal A, Dogra MR, Gupta V, et al. Outcome of cytomegalovirus retinitis in immunocompromised patients without Human Immunodeficiency Virus treated with intravitreal ganciclovir injection. Graefes Arch Clin Exp Ophthalmol. 2014;252:1393-401.", url: "https://doi.org/10.1007/s00417-014-2587-5" },
  { id: 99, kind: "As cited in the manuscript; not independently re-verified.", text: "Iu LP, Fan MC, Lau JK, Chan TS, Kwong YL, Wong IY. Long-term Follow-up of Cytomegalovirus Retinitis in Non-HIV Immunocompromised Patients: Clinical Features and Visual Prognosis. Am J Ophthalmol. 2016;165:145-53.", url: "https://doi.org/10.1016/j.ajo.2016.03.015" },
  { id: 100, kind: "As cited in the manuscript; not independently re-verified.", text: "Markan A, Gupta N, Dogra M, Sharma A, Singh R. Oral valganciclovir in human immunodeficiency virus-positive patients suffering from cytomegalovirus retinitis at a tertiary care hospital in North India. Indian J Ophthalmol. 2022;70:2472-2475.", url: "https://doi.org/10.4103/ijo.IJO_2787_21" },
  { id: 101, kind: "As cited in the manuscript; not independently re-verified.", text: "Pillet S, Pozzetto B, Jarlot C, Paul S, Roblin X. Management of cytomegalovirus infection in inflammatory bowel diseases. Dig Liver Dis. 2012;44:541-8.", url: "https://doi.org/10.1016/j.dld.2012.03.018" },
  { id: 102, kind: "As cited in the manuscript; not independently re-verified.", text: "Pillet S, Pozzetto B, Roblin X. Cytomegalovirus and ulcerative colitis: Place of antiviral therapy. World J Gastroenterol. 2016;22:2030-45.", url: "https://doi.org/10.3748/wjg.v22.i6.2030" },
  { id: 103, kind: "As cited in the manuscript; not independently re-verified.", text: "Contreras-Valero JF, Ruíz-Ordóñez I, Pinilla-Monsalve GD, Bautista-Vargas M, Ocampo-Piraquive V, Aguirre-Valencia D. Cytomegalovirus infection and disease in systemic lupus erythematosus patients at a high-complexity hospital in southwestern Colombia. Lupus. 2024;33:797-803.", url: "https://doi.org/10.1177/09612033241247103" },
  { id: 104, kind: "As cited in the manuscript; not independently re-verified.", text: "Fernández S, Castro P, Azoulay E. What intensivists need to know about cytomegalovirus infection in immunocompromised ICU patients. Intensive Care Med. 2025;51:39-61.", url: "https://doi.org/10.1007/s00134-024-07737-5" },
  { id: 105, kind: "As cited in the manuscript; not independently re-verified.", text: "Florescu DF, Kalil AC. Cytomegalovirus infections in non-immunocompromised and immunocompromised patients in the intensive care unit. Infect Disord Drug Targets. 2011;11:354-64.", url: "https://doi.org/10.2174/187152611796504773" },
  { id: 106, kind: "As cited in the manuscript; not independently re-verified.", text: "Park GE, Ki HK, Ko JH. Impact of antiviral treatment on long-term prognosis in non-immunocompromised patients with CMV reactivation. BMC Infect Dis. 2021;21:414.", url: "https://doi.org/10.1186/s12879-021-06098-4" },
  { id: 107, kind: "As cited in the manuscript; not independently re-verified.", text: "Jorgenson MR, Descourouez JL, Kleiboeker H, Goldrosen K, Schulz L, Rice JP, et al. Cytomegalovirus antiviral stewardship in solid organ transplant recipients: A new gold standard. Transpl Infect Dis. 2022;24:e13864.", url: "https://doi.org/10.1111/tid.13864" },
  { id: 108, kind: "As cited in the manuscript; not independently re-verified.", text: "Le Page AK, Jager MM, Kotton CN, Simoons-Smit A, Rawlinson WD. International survey of cytomegalovirus management in solid organ transplantation after the publication of consensus guidelines. Transplantation. 2013;95:1455-60.", url: "https://doi.org/10.1097/TP.0b013e31828ee12e" },
  { id: 109, kind: "As cited in the manuscript; not independently re-verified.", text: "Manuel O, Avery RK. Update on cytomegalovirus in transplant recipients: new agents, prophylaxis, and cell-mediated immunity. Curr Opin Infect Dis. 2021;34:307-313.", url: "https://doi.org/10.1097/QCO.0000000000000746" },
  { id: 110, kind: "As cited in the manuscript; not independently re-verified.", text: "Natori Y, Alghamdi A, Tazari M, Miller V, Husain S, Komatsu T, et al. Use of Viral Load as a Surrogate Marker in Clinical Studies of Cytomegalovirus in Solid Organ Transplantation: A Systematic Review and Meta-analysis. Clin Infect Dis. 2018;66:617-631.", url: "https://doi.org/10.1093/cid/cix793" }
];

const GLOSSARY = [
  { match: "SOT", full: "solid organ transplantation", def: "Transplantation of a solid organ (e.g. kidney, liver, lung) as opposed to haematopoietic stem cells." },
  { match: "HCT", full: "haematopoietic cell transplantation", def: "Transplantation of blood-forming stem cells, typically after myeloablative or reduced-intensity conditioning." },
  { match: "D/R", def: "Donor/recipient CMV serostatus (e.g. D+/R− = CMV-seropositive donor, CMV-seronegative recipient — the highest-risk pairing for primary CMV infection)." },
  { match: "CMI", full: "cell-mediated immunity", def: "T-cell-based immune response; CMV-specific CMI testing can identify patients whose own immunity has recovered enough to safely stop antiviral prophylaxis." },
  { match: "ANC", full: "absolute neutrophil count", def: "A blood count measuring circulating neutrophils. Ganciclovir and valganciclovir's dose-limiting toxicity is neutropenia, tracked via ANC." },
  { match: "ART", full: "antiretroviral therapy", def: "Treatment for HIV infection. Optimising ART improves immune control of CMV in people living with HIV." },
  { match: "G-CSF", full: "granulocyte colony-stimulating factor", def: "A growth factor given to stimulate neutrophil production, used to manage ganciclovir-related neutropenia." },
  { match: "VGC", full: "valganciclovir", def: "The oral valyl-ester prodrug of ganciclovir, with roughly 60% oral bioavailability." },
  { match: "GCV", full: "ganciclovir", def: "The parenteral antiviral valganciclovir is converted into after absorption; requires activation by viral UL97 kinase." },
  { match: "(V)GC", def: "Shorthand for \"(val)ganciclovir\" — ganciclovir or valganciclovir, used interchangeably where the distinction between the IV and oral form doesn't matter to the point being made." },
  { match: "UL97/UL54", def: "The two CMV genes most often mutated in drug-resistant CMV: UL97 (the viral kinase needed to activate ganciclovir) and UL54 (the viral DNA polymerase ganciclovir inhibits once activated)." },
  { match: "PCR", full: "polymerase chain reaction", def: "The molecular test used to quantify CMV viral load (DNAemia) in blood." },
  { match: "DNAemia", def: "Detectable CMV DNA in the blood — the surveillance marker used to trigger preemptive therapy and to track treatment response." },
  { match: "GRADE", def: "A standardised framework (high / moderate / low / very low) for rating how confident reviewers are in an effect estimate." },
  { match: "MCID", full: "minimal clinically important difference", def: "The smallest effect size the review's authors judged large enough to matter clinically — prespecified in this review as |Cohen's d| ≥ 0.20." }
];

// Drug/agent names emphasised wherever they appear in label/sub/meaning/
// rationale text — see app.js's highlightAgentsHtml()/linkify().
const AGENTS = ["Ganciclovir", "Valganciclovir", "Letermovir", "Maribavir", "Foscarnet", "Cidofovir", "Valacyclovir", "Acyclovir"];

const NODES = [
  {
    id: "entry_population",
    type: "trigger",
    label: "Immunosuppressed patient (SOT, HCT, HIV,\nhaematological malignancy, other)\nat risk of, or with, CMV infection",
    meaning: "Covers patients who are either at risk of CMV (not yet infected) or who already have CMV infection or disease, across the review's major immunosuppressed populations: solid organ transplant (SOT) recipients, haematopoietic cell transplant (HCT) recipients, people with advanced HIV, haematological malignancy, and other causes of impaired cell-mediated immunity (e.g. primary immunodeficiency, intensive immunosuppressive or biological therapy).",
    rationale: "Impaired cell-mediated immunity is what allows CMV to progress from asymptomatic DNAemia to CMV syndrome, tissue-invasive disease, and indirect complications such as allograft rejection, graft loss, superinfection, and excess mortality — which is why the algorithm opens by naming the at-risk populations rather than a single trigger test.",
    cautions: [
      "No age cutoff, immune-function cutoff, or specific CMV laboratory threshold is given for entry into the algorithm — the review's own eligibility criteria accept immunosuppressed patients of any age."
    ],
    refs: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },
  {
    id: "active_infection_decision",
    type: "decision",
    label: "Active CMV infection\nor disease?",
    meaning: "The first branch point: patients without active CMV infection or disease go to PREVENTION; patients who already have active infection or disease go to TREATMENT.",
    rationale: "The manuscript frames (val)ganciclovir's three main uses as universal prophylaxis, preemptive therapy triggered by surveillance-detected DNAemia, and treatment of established disease — this diamond is where that three-way framing is collapsed into a single prevention-vs-treatment fork.",
    cautions: [
      "The manuscript does not define what counts as a positive PCR, actionable DNAemia, or disease severity at this decision, and does not state how a patient already on preemptive therapy (itself listed under Prevention) should be routed if infection becomes active.",
      "A 400 copies/mL figure appears elsewhere in the review (the VIPP trial) but is not presented as this diamond's own universal trigger."
    ],
    refs: [15, 16, 17, 35, 36]
  },
  {
    id: "prevention_stratify",
    type: "branch",
    label: "PREVENTION: risk-stratify by\nD/R serostatus, organ type,\nlymphocyte-depleting induction",
    meaning: "For patients without active infection, prevention strategy is chosen by donor/recipient (D/R) CMV serostatus, transplant organ type, and whether lymphocyte-depleting induction was used — not by one rule applied to everyone.",
    rationale: "The review found opposing results for prophylaxis versus preemptive therapy depending on the population studied (e.g. R+ kidney vs D+/R− liver recipients), attributed to differences in surveillance intensity and population; CMI-guided stopping was only studied in a specific subgroup (R+ kidney recipients given antithymocyte globulin). International guidelines are cited as endorsing both prophylaxis and preemptive therapy, generally preferring prophylaxis in high-risk lung and intestinal recipients and leaving the choice to local practice elsewhere.",
    cautions: [
      "No numeric risk score or point system drives this stratification — it is a qualitative, population-based choice, not a calculator.",
      "The figure has no dedicated branch for lung, intestinal, D−/R−, HIV-prevention, or other non-transplant prevention, despite the broader at-risk population named at entry."
    ],
    refs: [15, 16, 35, 36, 37, 38, 39, 50, 75, 76]
  },
  {
    id: "sot_dr_neg",
    type: "process",
    label: "SOT D+/R−",
    sub: "• Kidney: VGC prophylaxis 200 d\n• Liver: VGC prophylaxis 100 d\n  or preemptive VGC (weekly PCR)",
    meaning: "In CMV-seronegative SOT recipients of a seropositive donor (the highest-risk serostatus pairing), kidney recipients get extended (200-day) valganciclovir prophylaxis; liver recipients get either 100-day prophylaxis or weekly-PCR-guided preemptive valganciclovir.",
    rationale: "IMPACT (318 D+/R− kidney recipients) found 200 days of prophylaxis roughly halved 2-year CMV disease versus 100 days (21.3% vs 38.7%), without a difference in rejection, graft loss, or survival. In liver recipients, CAPSIL (n=205) found weekly-PCR-guided preemptive valganciclovir for 100 days reduced 12-month CMV disease versus 100 days of fixed prophylaxis (9% vs 19%), attributed largely to preventing delayed-onset disease after prophylaxis ends; mortality did not differ between strategies.",
    dose: [
      ["Kidney (D+/R−)", "Valganciclovir prophylaxis, 200 days"],
      ["Liver (D+/R−)", "Valganciclovir prophylaxis, 100 days — or preemptive valganciclovir guided by weekly PCR"]
    ],
    cautions: [
      "The figure gives no prophylaxis dose, renal-adjustment schedule, preemptive viral-load trigger, or preemptive-course duration — only the strategy and duration are specified."
    ],
    refs: [39, 40, 43, 70]
  },
  {
    id: "sot_r_pos",
    type: "process",
    label: "SOT R+",
    sub: "• VGC prophylaxis ~3 months\n  or preemptive therapy\n• Consider CMI-guided stopping",
    meaning: "In CMV-seropositive SOT recipients, either roughly 3 months of valganciclovir prophylaxis or preemptive therapy is reasonable, with cell-mediated-immunity (CMI)-guided discontinuation a further option.",
    rationale: "VIPP found 100 days of prophylaxis reduced 12-month CMV infection and, at 84 months, CMV disease (4.7% vs 15.9%) versus preemptive therapy, without differences in graft loss, death, rejection, or renal function; OVERT found similar (4%) CMV disease in both arms, with prophylaxis costing more drug exposure and neutropenia — so the review leaves the choice dependent on patient risk and monitoring capacity rather than naming one preferred strategy. For CMI-guided stopping, a trial in 150 R+ kidney recipients given antithymocyte globulin found stopping prophylaxis once CMV-specific CMI was detected was non-inferior to 90 fixed days and roughly quartered neutropenia; a separate trial in 150 R+ lung recipients found an immunoguided strategy non-inferior to 6 months of standard prophylaxis and reduced valganciclovir exposure, though CMV disease occurred earlier with that strategy.",
    cautions: [
      "The figure's generic '~3 months' does not distinguish the organ-specific durations actually studied (100 days, 90 days, 3 months, 6 months in different trials) — these are not interchangeable universal numbers.",
      "No CMI assay name, positivity threshold, assay timing, or preemptive PCR trigger is specified; CMI-guided stopping is not a named, weighted clinical score."
    ],
    refs: [35, 36, 37, 50, 51]
  },
  {
    id: "hct_r_pos",
    type: "process",
    label: "HCT R+",
    sub: "• Letermovir prophylaxis\n• Preemptive (V)GC if infection",
    meaning: "In CMV-seropositive HCT recipients, letermovir is used for prevention; (val)ganciclovir is reserved for preemptive treatment if infection occurs.",
    rationale: "A matched cohort found primary letermovir prophylaxis associated with markedly less clinically significant CMV infection than preemptive (val)ganciclovir-based therapy in both high-risk (20.4% vs 70.4%) and standard-risk (2.9% vs 35.3%) recipients, with fewer CMV-related readmissions and lower costs, though no survival difference. Separately, AURORA (first asymptomatic HCT CMV infection) found valganciclovir achieved higher week-8 viraemia clearance than maribavir (77.4% vs 69.6%), at the cost of more neutropenia (52.9% vs 16.1%) — supporting valganciclovir's continued preemptive-therapy role even as letermovir displaces it from primary prophylaxis.",
    cautions: [
      "No letermovir dose/duration, PCR surveillance interval, viral-load trigger, or (val)ganciclovir dose is given in this box.",
      "The manuscript does not define what counts as 'letermovir breakthrough', the point at which valganciclovir is said to become the preferred preemptive agent."
    ],
    refs: [57, 58, 63]
  },
  {
    id: "leukopenia_neutropenia",
    type: "process",
    label: "Leukopenia/neutropenia on VGC?",
    sub: "• Kidney D+/R−: switch to letermovir\n• Kidney: consider 450 mg/day\n• Check renal dose adjustment",
    meaning: "If leukopenia or neutropenia develops during valganciclovir prophylaxis: switch D+/R− kidney recipients to letermovir, consider a reduced 450 mg/day dose in kidney recipients generally, and check the renal dose adjustment.",
    rationale: "In the 601-patient D+/R− kidney letermovir trial, letermovir was non-inferior to valganciclovir for CMV disease (10.4% vs 11.8%) with far less leukopenia/neutropenia (26% vs 64%) and fewer adverse-event discontinuations — direct comparative support for the switch-to-letermovir option, though that trial compared the two drugs head-to-head rather than specifically re-randomising patients after cytopenia developed (actual post-intolerance switching comes from separate observational lung cohorts). For the reduced dose, a trial in 196 intermediate-risk kidney recipients found 450 mg/day as effective as 900 mg/day with less leukopenia and less need for G-CSF, and a retrospective study in 237 high-risk D+/R− kidney recipients found similar unadjusted CMV disease and a lower adjusted risk with the low dose, less leukopenia, and no excess resistance.",
    cautions: [
      "GRADE rates certainty for low-dose vs standard-dose prophylaxis as low, and the manuscript cautions these data are mostly from kidney recipients and retrospective cohorts — they should not be extrapolated to lung or D+/R− liver recipients without caution.",
      "An international survey cited in the manuscript found valganciclovir was often dosed below recommendations and neutropenia commonly managed by dose reduction or withdrawal — practices that may promote resistance — so '450 mg/day' is a kidney-specific option, not a manuscript-wide instruction to reduce doses generally.",
      "No ANC/leukocyte trigger is given in this box, and no renal-function formula or creatinine-clearance table is supplied for the 'check renal dose adjustment' instruction."
    ],
    refs: [18, 19, 20, 21, 22, 46, 47, 52, 108]
  },
  {
    id: "evidence_box",
    type: "process",
    tone: "note",
    label: "Evidence (this review)",
    sub: "• Oral VGC ≈ IV GCV for non-severe\n  disease (moderate certainty)\n• Prophylaxis vs preemptive: similar\n  mortality (moderate certainty)\n• 200 vs 100 days of VGC: less CMV\n  disease (moderate certainty)\n• Letermovir ≈ VGC, less myelotoxicity\n  (high certainty for safety)\n• Maribavir > (V)GC-containing therapy\n  in refractory CMV (moderate certainty)",
    meaning: "A standalone evidence summary — no incoming or outgoing arrow — giving the review's own headline comparative findings and their GRADE certainty, as a quick-reference panel rather than a treatment step.",
    rationale: "Each bullet reflects the review's own synthesis: VICTOR supports oral valganciclovir ≈ IV ganciclovir for non-severe disease (moderate certainty, limited by few severe/life-threatening cases); prophylaxis and preemptive therapy show similar mortality (moderate certainty), though CMV-disease pooling was too heterogeneous for a reliable pooled estimate; IMPACT supports 200 over 100 days of valganciclovir in D+/R− kidney recipients (moderate certainty); letermovir matches valganciclovir efficacy with substantially less myelotoxicity (high certainty for that safety finding specifically); and SOLSTICE supports maribavir over (val)ganciclovir-containing therapy in refractory CMV (moderate certainty, open-label, heterogeneous comparator).",
    cautions: [
      "'Maribavir > (V)GC-containing therapy' compresses a heterogeneous comparator — SOLSTICE's comparison arm was investigator-assigned therapy with valganciclovir/ganciclovir, foscarnet, or cidofovir, not a pure two-drug maribavir-vs-ganciclovir trial.",
      "This box is deliberately disconnected in the diagram — a reference summary, not a step to act on in sequence."
    ],
    refs: [30, 32, 33, 34, 35, 36, 37, 38, 39, 43, 52, 59, 60]
  },
  {
    id: "treatment_severity",
    type: "decision",
    label: "TREATMENT: assess severity\nLife- or sight-threatening disease,\nhigh viral load, malabsorption?",
    meaning: "For patients with active CMV infection or disease, the next step is assessing severity: life- or sight-threatening disease, a high viral load, or malabsorption push toward intravenous treatment (YES); otherwise oral treatment is an option (NO).",
    rationale: "The manuscript explicitly attributes this route-selection approach to current guidelines. Supporting trial evidence (VICTOR) showing oral valganciclovir is non-inferior to IV ganciclovir was itself studied only in non-life-threatening SOT disease, so it does not by itself establish equivalence in severe disease.",
    cautions: [
      "No numerical definition of 'high viral load', a formal severity score, or a specific malabsorption test is given, and the manuscript does not state whether the three listed conditions are individually sufficient or must occur together.",
      "GRADE rates the oral-vs-IV comparison only moderate certainty, downgraded for indirectness, because few of the comparison's patients had severe or life-threatening disease, or were lung/intestinal transplant recipients."
    ],
    refs: [15, 16, 30, 32, 33, 34]
  },
  {
    id: "iv_ganciclovir",
    type: "branch",
    label: "YES",
    sub: "IV ganciclovir\n5 mg/kg q12h\n(renal dosing)",
    meaning: "The intravenous route, used when the severity assessment is YES: ganciclovir 5 mg/kg every 12 hours, adjusted for renal function.",
    rationale: "This is the regimen VICTOR itself used for its IV arm — 5 mg/kg twice daily for 21 days, with valganciclovir maintenance to day 49 in both study arms — alongside the broader guideline-based rationale that severe or life-threatening disease, high viral load, or questionable gastrointestinal absorption favour the IV route over oral.",
    dose: [["IV ganciclovir", "5 mg/kg every 12 hours (renal dosing)"]],
    cautions: [
      "No creatinine-clearance bands, adjusted doses, or dialysis schedule are given for 'renal dosing' — flagged as an unresolved implementation detail, not a complete dosing calculator."
    ],
    refs: [15, 16, 32, 33, 34]
  },
  {
    id: "oral_valganciclovir",
    type: "branch",
    label: "NO",
    sub: "Oral VGC\n900 mg q12h\n(renal dosing)",
    meaning: "The oral route, used when the severity assessment is NO: valganciclovir 900 mg every 12 hours, adjusted for renal function.",
    rationale: "VICTOR's oral arm used 900 mg twice daily for 21 days, then valganciclovir maintenance to day 49; day-49 investigator-assessed treatment success was statistically equivalent to the IV arm (85.4% vs 84.1%; Cohen's d = −0.09, trivial and non-significant), and one-year mortality did not differ (11 vs 9 deaths among 321 patients).",
    dose: [["Oral valganciclovir", "900 mg every 12 hours (renal dosing)"]],
    cautions: [
      "These findings come from VICTOR's non-life-threatening SOT population — GRADE rates the comparison moderate certainty, downgraded for indirectness to more severe disease and to lung/intestinal transplantation."
    ],
    refs: [15, 16, 32, 33]
  },
  {
    id: "immunosuppression_art_retinitis",
    type: "process",
    label: "Reduce immunosuppression if possible",
    sub: "HIV: start or optimise ART; retinitis:\nsystemic (V)GC ± intravitreal GCV",
    meaning: "Both treatment routes lead here: consider reducing immunosuppression if feasible, start or optimise antiretroviral therapy in HIV-related CMV, and for retinitis give systemic (val)ganciclovir, with intravitreal ganciclovir added if needed.",
    rationale: "In the LSOCA cohort of 250 patients with AIDS-related CMV retinitis, systemic anti-CMV regimens (chiefly ganciclovir/valganciclovir) were associated with roughly half the mortality, a 90% reduction in new visceral CMV disease, and an 80% reduction in second-eye involvement, compared with intraocular therapy alone — intraocular-only regimens were associated with more retinitis progression and visual-field loss.",
    cautions: [
      "The manuscript does not specify the indication, extent, or timing for reducing immunosuppression as a CMV treatment adjunct, nor an ART initiation/optimisation regimen or timing.",
      "No dose, injection frequency, or duration is given for the optional intravitreal ganciclovir addition, and GRADE rates the LSOCA mortality evidence only low certainty (observational)."
    ],
    refs: [65]
  },
  {
    id: "weekly_monitoring",
    type: "process",
    label: "Weekly CMV viral load, CBC, creatinine;\nswitch IV to oral when improving",
    meaning: "During treatment: weekly CMV viral load, complete blood count, and creatinine; switch from IV to oral once the patient is improving.",
    rationale: "Persistent DNAemia predicts recurrence and resistance in the review's VICTOR-linked follow-up analyses, haematological toxicity is the dominant treatment-limiting adverse effect, and impaired renal function at treatment start is associated with ganciclovir-related neutropenia — reasons to track viral load, counts, and renal function together during treatment.",
    cautions: [
      "No source in the manuscript states a weekly cadence for all three measures together during treatment — the manuscript's explicit 'weekly plasma PCR for 100 days' belongs to CAPSIL's liver-transplant preemptive prevention strategy, a different context.",
      "'When improving' has no specified viral-load decline, clinical measure, or time interval attached to it in the source text."
    ],
    refs: [19, 33, 34, 52, 57, 67]
  },
  {
    id: "anc_check",
    type: "process",
    tone: "alarm",
    label: "ANC < 1.0 × 10⁹/L?",
    sub: "• G-CSF; review myelotoxic co-drugs\n• HCT: maribavir or foscarnet\n• SOT: foscarnet",
    meaning: "If absolute neutrophil count falls below 1.0 × 10⁹/L during treatment: give G-CSF and review other myelotoxic drugs; in HCT recipients consider switching to maribavir or foscarnet, in SOT recipients to foscarnet.",
    rationale: "Neutropenia affects roughly half to two-thirds of valganciclovir recipients in recent RCTs (e.g. 52.9% with valganciclovir vs 16.1% with maribavir in AURORA, with more discontinuations for neutropenia too); foscarnet is presented as a ganciclovir-sparing alternative when neutropenia precludes continued ganciclovir, at the cost of renal and electrolyte toxicity.",
    cautions: [
      "The ANC < 1.0 × 10⁹/L threshold is not attached to a specific primary study or guideline citation in the supporting text — it is a figure-only cutoff.",
      "The figure draws this as a double-bordered, single-arrow checkpoint rather than a labelled Yes/No branch, and does not state what happens when ANC is at or above the threshold, or whether the three listed actions are simultaneous, sequential, or alternatives.",
      "Maribavir is listed here for HCT neutropenia specifically; its strongest trial evidence (SOLSTICE) was for refractory CMV in both HCT and SOT, a different indication — these populations should not be conflated."
    ],
    refs: [46, 52, 57, 59, 60, 61]
  },
  {
    id: "resistance_check",
    type: "process",
    tone: "alarm",
    label: "Viral load not falling after ≥ 2 weeks?",
    sub: "• Genotypic resistance testing\n  (UL97/UL54)\n• Maribavir, foscarnet, or cidofovir",
    meaning: "If viral load is not falling after at least 2 weeks of treatment: send genotypic resistance testing (UL97/UL54) and consider maribavir, foscarnet, or cidofovir.",
    rationale: "Prolonged or subtherapeutic ganciclovir exposure is linked to UL97/UL54 resistance mutations, and persistent DNAemia is linked to emergent resistance in the review's VICTOR-derived analysis; the manuscript calls for early genotypic testing when viral load fails to decline rather than prolonging ganciclovir empirically. In SOLSTICE, maribavir achieved higher week-8 clearance than investigator-assigned therapy (valganciclovir/ganciclovir, foscarnet, or cidofovir) in refractory infection (55.7% vs 23.9%), including patients with baseline resistance in 56–68% of cases.",
    cautions: [
      "The '≥ 2 weeks' threshold is not tied to a specific primary-study or guideline source in the supporting text — a figure-only cutoff, distinct from VICTOR's separately reported day-21 persistence finding.",
      "The figure draws this as a double-bordered, single-arrow checkpoint with no labelled Yes/No branch or loop back to monitoring; no viral-load minimum for ordering testing, mutation-interpretation rule, drug-selection-by-genotype rule, or dose is given for the three listed alternatives."
    ],
    refs: [18, 19, 20, 21, 59, 60, 61]
  },
  {
    id: "response_endpoint",
    type: "terminal",
    label: "Response: continue until DNAemia\nis undetectable (minimum 2 weeks);\nconsider secondary prophylaxis by risk",
    meaning: "The treatment endpoint: continue therapy until DNAemia is undetectable, for a minimum of 2 weeks, then consider secondary prophylaxis based on the patient's risk.",
    rationale: "VICTOR's own follow-up linked failure to eradicate DNAemia by day 21 with later recurrence, supporting continuation of therapy until DNAemia is undetectable to reduce the risk of recurrence and resistance.",
    cautions: [
      "The 'minimum 2 weeks' duration is not separately derived in the supporting prose or tied to a specific guideline source, and the figure does not clarify whether it means total treatment duration or a required period of confirmed-undetectable DNAemia.",
      "The risk factors that should trigger secondary prophylaxis, and its drug, dose, and duration, are not specified anywhere in the source material."
    ],
    refs: [32, 33, 34, 67]
  }
];
