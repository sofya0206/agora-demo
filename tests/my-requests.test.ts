import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildRequestsHref,
  readRequestFilter,
  readRequestNumber,
} from "../src/app/my-requests/components/request-url";
import { getRequestStepStates } from "../src/app/my-requests/components/request-status";
import { readRequests } from "../src/app/my-requests/components/request-data";

function request(patch: object = {}) {
  return {
    id: "request-1",
    number: 1,
    createdAt: "2026-09-04T09:00:00.000Z",
    supplierId: 7,
    supplierName: "Поставщик",
    supplierLogoUrl: null,
    currency: "RUB",
    preliminaryTotal: 350,
    status: "sent",
    items: [
      {
        offerId: 1,
        title: "Товар",
        supplierId: 7,
        supplierName: "Поставщик",
        supplierLogoUrl: null,
        price: 3.5,
        currency: "RUB",
        priceBasis: "шт",
        quantity: 100,
        moq: 100,
        photoUrl: null,
      },
    ],
    ...patch,
  };
}

test("все пять статусов соответствуют вариантам Figma", () => {
  assert.deepEqual(getRequestStepStates("sent"), [
    "done",
    "pending",
    "pending",
    "pending",
  ]);
  assert.deepEqual(getRequestStepStates("viewed"), [
    "done",
    "active",
    "pending",
    "pending",
  ]);
  assert.deepEqual(getRequestStepStates("discussion"), [
    "done",
    "done",
    "active",
    "pending",
  ]);
  assert.deepEqual(getRequestStepStates("confirmed"), [
    "done",
    "done",
    "done",
    "done",
  ]);
  assert.deepEqual(getRequestStepStates("rejected"), [
    "done",
    "done",
    "done",
    "rejected",
  ]);
});

test("неизвестный фильтр не ломает список", () => {
  for (const value of [null, "", "unknown", "__proto__"])
    assert.equal(readRequestFilter(value), "all");
  for (const value of ["sent", "viewed", "discussion", "confirmed", "rejected"])
    assert.equal(readRequestFilter(value), value);
});

test("номер заявки должен быть положительным целым числом", () => {
  assert.equal(readRequestNumber("6"), 6);
  for (const value of [
    null,
    "",
    "0",
    "-1",
    "1.5",
    "1e2",
    "01",
    " 2",
    "9007199254740992",
  ])
    assert.equal(readRequestNumber(value), null);
});

test("открытие и закрытие сохраняют фильтр и исходные параметры", () => {
  const params = new URLSearchParams("status=viewed&source=test");
  assert.equal(
    buildRequestsHref(params, { requestNumber: 6 }),
    "/my-requests?status=viewed&source=test&request=6",
  );
  assert.equal(params.toString(), "status=viewed&source=test");
  assert.equal(
    buildRequestsHref(new URLSearchParams("status=viewed&request=6"), {
      requestNumber: null,
    }),
    "/my-requests?status=viewed",
  );
});

test("смена фильтра закрывает заявку, Все заявки убирает status", () => {
  const params = new URLSearchParams("status=viewed&request=6");
  assert.equal(
    buildRequestsHref(params, { filter: "confirmed" }),
    "/my-requests?status=confirmed",
  );
  assert.equal(buildRequestsHref(params, { filter: "all" }), "/my-requests");
});

test("пустые и повреждённые данные не роняют экран", () => {
  for (const value of [null, {}, "[]", [], [null, 12, {}, "request"]])
    assert.deepEqual(readRequests(value), []);
  for (const patch of [
    { status: "unknown" },
    { items: null },
    { items: [null] },
    { number: -1 },
    { createdAt: "invalid" },
    { preliminaryTotal: Infinity },
  ])
    assert.deepEqual(readRequests([request(patch)]), []);
});

test("цена по запросу сохраняется после JSON и не превращается в ноль", () => {
  const value = request();
  value.items[0].price = Number.NaN;
  const [result] = readRequests(JSON.parse(JSON.stringify([value])));
  assert.equal(Number.isNaN(result.items[0].price), true);
});

test("смешанная или повреждённая заявка не показывается частично", () => {
  const value = request();
  value.items.push({ ...value.items[0], offerId: 2, supplierId: 8 });
  assert.deepEqual(readRequests([value]), []);
  value.items[1].supplierId = 7;
  value.items[1].quantity = -10;
  assert.deepEqual(readRequests([value]), []);
});

test("заявки сортируются по номеру, дубликаты не создают одинаковые ссылки", () => {
  const source = [
    request(),
    request({ id: "request-2", number: 2 }),
    request(),
  ];
  const result = readRequests(source);
  assert.deepEqual(
    result.map((item) => item.number),
    [2, 1],
  );
  assert.equal(source[0].number, 1);
});

test("обновлённая запись заменяет состав, сумму и статус без изменения источника", () => {
  const original = request();
  const updated = request({
    status: "discussion",
    preliminaryTotal: 900,
    items: [{ ...original.items[0], price: 9 }],
  });
  const [result] = readRequests([updated]);
  assert.equal(result.status, "discussion");
  assert.equal(result.preliminaryTotal, 900);
  assert.equal(result.items[0].price, 9);
  assert.equal(original.items[0].price, 3.5);
});
