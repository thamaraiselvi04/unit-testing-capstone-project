const unitTestingTask = require("./unitTestingTask");
const timezonedDate = require("timezoned-date");

describe("unitTestingTask", () => {
    beforeAll(() => {
        unitTestingTask.lang("en");
    });

    const getDate = (mockedDate, offset = 0) => {
        const UtcDate = timezonedDate.makeConstructor(offset);
        const date = new UtcDate(mockedDate);
        return date;
    };

    let originalUnitTestingTask;

    describe("noConflict", () => {
        beforeAll(() => {
            originalUnitTestingTask = global.unitTestingTask;
        });

        afterAll(() => {
            global.unitTestingTask = originalUnitTestingTask;
        });

        it("should restore the original unitTestingTask in the global namespace and return itself", () => {
            const mockPreviousUnitTestingTask = {
                name: "mockPreviousUnitTestingTask",
            };
            global.unitTestingTask = mockPreviousUnitTestingTask;
            const result = unitTestingTask.noConflict();
            expect(global.unitTestingTask).toBe(mockPreviousUnitTestingTask);
            expect(result).toBe(unitTestingTask);
        });
    });

    describe("tokens", () => {
        const date = new Date("2024-07-07T05:09:03.07Z");

        test("should formats date tokens to return full year", () => {
            expect(unitTestingTask("YYYY", getDate(date))).toBe("2024");
        });

        test("should formats date tokens to return short year", () => {
            expect(unitTestingTask("YY", getDate(date))).toBe("24");
        });

        test("should formats date tokens to return full month", () => {
            expect(unitTestingTask("MMMM", getDate(date))).toBe("July");
        });

        test("should formats date tokens to return short month", () => {
            expect(unitTestingTask("MMM", getDate(date))).toBe("Jul");
        });

        test("should formats date tokens to return month in number with zero", () => {
            expect(unitTestingTask("MM", getDate(date))).toBe("07");
        });

        test("should formats date tokens to return month in number without zero", () => {
            expect(unitTestingTask("M", getDate(date))).toBe("7");
        });

        test("should formats date tokens to return full day", () => {
            expect(unitTestingTask("DDD", getDate(date))).toBe("Sunday");
        });

        test("should formats date tokens to return short day", () => {
            expect(unitTestingTask("DD", getDate(date))).toBe("Sun");
        });

        test("should formats date tokens to return shorter day", () => {
            expect(unitTestingTask("D", getDate(date))).toBe("Su");
        });

        test("should formats date tokens to return date with zero", () => {
            expect(unitTestingTask("dd", getDate(date))).toBe("07");
        });

        test("should formats date tokens to return date without zero", () => {
            expect(unitTestingTask("d", getDate(date))).toBe("7");
        });

        test("should formats date tokens to return date without zero", () => {
            expect(unitTestingTask("d", getDate(date))).toBe("7");
        });

        test("should formats date tokens to return hour with zero", () => {
            expect(unitTestingTask("HH", getDate(date))).toBe("05");
        });

        test("should formats date tokens to return hour without zero", () => {
            expect(unitTestingTask("H", getDate(date))).toBe("5");
        });

        test("should formats date tokens to return hour with zero by passing hh", () => {
            expect(unitTestingTask("hh", getDate(date))).toBe("05");
        });

        test("should formats date tokens to return hour without zero by passing h", () => {
            expect(unitTestingTask("h", getDate(date))).toBe("5");
        });

        test("should formats date tokens to return minutes with zero", () => {
            expect(unitTestingTask("mm", getDate(date))).toBe("09");
        });

        test("should formats date tokens to return minutes without zero", () => {
            expect(unitTestingTask("m", getDate(date))).toBe("9");
        });

        test("should formats date tokens to return seconds with zero", () => {
            expect(unitTestingTask("ss", getDate(date))).toBe("03");
        });

        test("should formats date tokens to return seconds without zero", () => {
            expect(unitTestingTask("s", getDate(date))).toBe("3");
        });

        test("should formats date tokens to return milliseconds with zero", () => {
            expect(unitTestingTask("ff", getDate(date))).toBe("070");
        });

        test("should formats date tokens to return milliseconds without zero", () => {
            expect(unitTestingTask("f", getDate(date))).toBe("70");
        });

        test("should formats date tokens to return time-zone in ISO8601-compatible basic format", () => {
            expect(unitTestingTask("ZZ", getDate(date))).toBe("+0000");
        });

        test("should formats date tokens to return time-zone in ISO8601-compatible extended format", () => {
            expect(unitTestingTask("Z", getDate(date))).toBe("+00:00");
        });

        test("should formats date tokens to return AM caps", () => {
            expect(unitTestingTask("A", getDate(date))).toBe("AM");
        });

        test("should formats date tokens to return am small", () => {
            expect(unitTestingTask("a", getDate(date))).toBe("am");
        });

        test("should formats date tokens to return PM caps", () => {
            const updatedDate = new Date("2023-06-17T13:09:03.456Z");
            expect(unitTestingTask("A", getDate(updatedDate))).toBe("PM");
        });

        test("should formats date tokens to return pm small", () => {
            const updatedDate = new Date("2023-06-17T13:09:03.456Z");
            expect(unitTestingTask("a", getDate(updatedDate))).toBe("pm");
        });

        test("returns original string if no matching token", () => {
            const format = "No Token";
            const date = new Date("2023-06-17T05:09:03.456Z");
            expect(unitTestingTask(format, getDate(date))).toBe(format);
        });

        test("should handles unix timestamp date inputs", () => {
            expect(unitTestingTask("YYYY", 1686997743456)).toBe("2023");
        });

        test("ahould handles ISO date string inputs", () => {
            expect(unitTestingTask("YYYY", "2023-06-17T05:09:03.456Z")).toBe("2023");
        });
    });

    describe("custom formats", () => {
        const date = new Date("2023-06-17T15:24:30.456Z");

        test("registers and formats custom formats", () => {
            unitTestingTask.register("customFormat", "YYYY/MM/dd");
            expect(unitTestingTask("customFormat", getDate(date))).toBe("2023/06/17");
        });

        test("should formats predefined ISO formats date", () => {
            expect(unitTestingTask("ISODate", getDate(date))).toBe("2023-06-17");
        });

        test("should formats predefined ISO formats time", () => {
            expect(unitTestingTask("ISOTime", getDate(date))).toBe("03:24:30");
        });

        test("should formats predefined ISO formats date time", () => {
            expect(unitTestingTask("ISODateTime", getDate(date))).toBe(
                "2023-06-17T03:24:30"
            );
        });

        test("should formats predefined ISO formats date time with zone", () => {
            expect(unitTestingTask("ISODateTimeTZ", getDate(date))).toBe(
                "2023-06-17T03:24:30+00:00"
            );
        });
    });

    describe("error handling", () => {
        test("throws TypeError if format is not a string", () => {
            expect(() => unitTestingTask(123)).toThrow(TypeError);
        });

        test("throws TypeError if date is not a valid type", () => {
            expect(() => unitTestingTask("YYYY", {})).toThrow(TypeError);
        });
    });

    describe("language support", () => {
        test("sets and gets the current language", () => {
            expect(unitTestingTask.lang()).toBe("en");
            unitTestingTask.lang("fr", {
                _months:
                    "Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre".split(
                        "_"
                    ),
                months: function (date) {
                    return this._months[date.getMonth()];
                },
                _monthsShort: "Jan_Fév_Mar_Avr_Mai_Jui_Juil_Aoû_Sep_Oct_Nov_Déc".split(
                    "_"
                ),
                monthsShort: function (date) {
                    return this._monthsShort[date.getMonth()];
                },
                weekdays: "Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi".split(
                    "_"
                ),
                weekdaysShort: "Dim_Lun_Mar_Mer_Jeu_Ven_Sam".split("_"),
                weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
                meridiem: function (hours, isLower) {
                    return hours > 11 ? (isLower ? "pm" : "PM") : isLower ? "am" : "AM";
                },
            });
            expect(unitTestingTask.lang()).toBe("fr");
            unitTestingTask.lang("en");
        });
    });
});
